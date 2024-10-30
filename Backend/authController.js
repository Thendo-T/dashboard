const bcrypt = require("bcryptjs");
const pool = require("./db");
async function registerUser(req, res) {
  const { email, name, password } = req.body;

  console.log("Incoming registration data:", { email, name, password });

  try {
    const userCheck = await pool.query(
      'SELECT * FROM public."Users" WHERE "Email" = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public."Users" ("Email", "Name", "Password", "isloggedin") VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, hashedPassword, false] // Set isloggedin to false explicitly
    );

    console.log("New user created:", newUser.rows[0]);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Login an existing user
// Assuming you have a global variable to track active user sessions
let activeUserSessions = {}; // { userId: true }

// Function to fetch the ID of the logged-in user
async function getLoggedInUserId(req, res) {
  // Assuming you pass user ID in the request body (this can be adjusted as needed)
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Check if the user is logged in
  if (!activeUserSessions[id]) {
    return res.status(404).json({ message: "User not logged in" });
  }

  res.status(200).json({ userId: id });
}

async function logoutUser(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!activeUserSessions[id]) {
      return res.status(404).json({ message: "User not logged in" });
    }

    const result = await pool.query(
      'UPDATE public."Users" SET "isloggedin" = FALSE WHERE "id" = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already logged out" });
    }

    delete activeUserSessions[id];

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Login function - update to store the user ID in active sessions
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Step 1: Retrieve the user by email
    const user = await pool.query(
      'SELECT * FROM public."Users" WHERE "Email" = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Step 2: Check the password
    const isMatch = await bcrypt.compare(password, user.rows[0].Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userId = user.rows[0].id; // Get the user ID

    // Step 3: Mark the user as logged in
    activeUserSessions[userId] = true; // Store in the active sessions map

    // Update isLoggedIn status in the database
    await pool.query(
      'UPDATE public."Users" SET "isloggedin" = TRUE WHERE "id" = $1',
      [userId]
    );

    // Return user data without password
    const { Password, ...userData } = user.rows[0];
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
}

let cachedActiveUsers = null; // Cache for active users
let lastFetchTime = null; // Track the last fetch time

async function getActiveUsers(req, res) {
  const cacheDuration = 60000; // Cache duration of 1 minute

  const now = Date.now();

  // Check if we have cached data and if it's still valid
  if (cachedActiveUsers !== null && now - lastFetchTime < cacheDuration) {
    console.log("Returning cached active users count.");
    return res.status(200).json({ activeUsers: cachedActiveUsers });
  }

  try {
    const activeUsers = await pool.query(
      'SELECT COUNT(*) FROM public."Users" WHERE "isloggedin" = TRUE'
    );

    // Update cache
    cachedActiveUsers = activeUsers.rows[0].count;
    lastFetchTime = now; // Update last fetch time

    res.status(200).json({ activeUsers: cachedActiveUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

let cachedNewUsersCount = null; // Cache for the number of new users
let lastFetchTimeForNewUsers = null; // Track the last fetch time for new users

async function getNewUsersLastWeek(req, res) {
  const cacheDuration = 60000; // Cache duration of 1 minute
  const now = Date.now();

  // Check if we have cached data and if it's still valid
  if (
    cachedNewUsersCount !== null &&
    now - lastFetchTimeForNewUsers < cacheDuration
  ) {
    console.log("Returning cached new users count for the past week.");
    return res.status(200).json({ newUsers: cachedNewUsersCount });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date for one week ago

    const newUsers = await pool.query(
      'SELECT COUNT(*) FROM public."Users" WHERE "Created_date" >= $1', // Adjust the date column as necessary
      [oneWeekAgo]
    );

    // Update cache
    cachedNewUsersCount = newUsers.rows[0].count;
    lastFetchTimeForNewUsers = now; // Update last fetch time

    res.status(200).json({ newUsers: cachedNewUsersCount });
  } catch (error) {
    console.error("Error fetching new users count:", error);
    res.status(500).json({ message: "Server error" });
  }
}

let cachedTotalUsers = null; // Cache for the total number of users
let lastFetchTimeForTotalUsers = null; // Track the last fetch time for total users

async function getTotalUsers(req, res) {
  const cacheDuration = 86400000; // Cache duration of 24 hours (in milliseconds)
  const now = Date.now();

  // Check if we have cached data and if it's still valid
  if (
    cachedTotalUsers !== null &&
    now - lastFetchTimeForTotalUsers < cacheDuration
  ) {
    console.log("Returning cached total users count.");
    return res.status(200).json({ totalUsers: cachedTotalUsers });
  }

  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM public."Users"');

    // Update cache
    cachedTotalUsers = totalUsers.rows[0].count;
    lastFetchTimeForTotalUsers = now; // Update last fetch time

    res.status(200).json({ totalUsers: cachedTotalUsers });
  } catch (error) {
    console.error("Error fetching total users count:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getLoggedInUserName(req, res) {
  const { id } = req.body; // Get the user ID from the request body

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Check if the user is logged in
  if (!activeUserSessions[id]) {
    return res.status(404).json({ message: "User not logged in" });
  }

  try {
    // Fetch the user's name from the database
    const user = await pool.query(
      'SELECT "Name" FROM public."Users" WHERE "id" = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: user.rows[0].Name });
  } catch (error) {
    console.error("Error fetching logged-in user name:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getActiveUsers,
  getNewUsersLastWeek,
  getTotalUsers,
  getLoggedInUserName,
};
