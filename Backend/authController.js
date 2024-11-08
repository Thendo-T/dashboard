const bcrypt = require("bcryptjs"); 
const pool = require("./db");
const jwt = require("jsonwebtoken");

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

// Login function
let activeUserSessions = {}; // { userId: true }

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public."Users" WHERE "Email" = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userId = user.rows[0].id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    await pool.query('UPDATE public."Users" SET "isloggedin" = TRUE WHERE "id" = $1', [userId]);

    res.status(200).json({
      message: "Login successful",
      token, // Send the token back to the client
      user: { ...user.rows[0], Password: undefined }, // Omit password from response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
}

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Assumes "Bearer <token>" format

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach userId to the request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

async function logoutUser(req, res) {
  const userId = req.userId; // Get the userId from the token

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await pool.query('UPDATE public."Users" SET "isloggedin" = FALSE WHERE "id" = $1', [userId]);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getActiveUsers(req, res) {
  try {
    const activeUsers = await pool.query(
      'SELECT COUNT(*) FROM public."Users" WHERE "isloggedin" = TRUE'
    );
    res.status(200).json({ activeUsers: activeUsers.rows[0].count });
  } catch (error) {
    console.error("Error fetching active users count:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getNewUsersLastWeek(req, res) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date for one week ago

    const newUsers = await pool.query(
      'SELECT COUNT(*) FROM public."Users" WHERE "Created_date" >= $1',
      [oneWeekAgo]
    );
    res.status(200).json({ newUsers: newUsers.rows[0].count });
  } catch (error) {
    console.error("Error fetching new users count:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTotalUsers(req, res) {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM public."Users"');
    res.status(200).json({ totalUsers: totalUsers.rows[0].count });
  } catch (error) {
    console.error("Error fetching total users count:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getLoggedInUserName(req, res) {
  const { id } = req.query; // Get the user ID from the query parameters

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
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
  authenticateToken
};
