const bcrypt = require("bcryptjs");
const pool = require("./db");
async function registerUser(req, res) {
  const { email, name, password } = req.body; 

  console.log("Incoming registration data:", { email, name, password });

  try {
    // Check if the email is already in use
    const userCheck = await pool.query(
      'SELECT * FROM public."Users" WHERE "Email" = $1',
      [email]
    );
    console.log("User check result:", userCheck.rows);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user without interests
    const newUser = await pool.query(
      'INSERT INTO public."Users" ("Email", "Name", "Password") VALUES ($1, $2, $3) RETURNING *',
      [email, name, hashedPassword] // Ensure that only scalar values are inserted
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
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      'SELECT * FROM public."Users" WHERE "Email" = $1',
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { registerUser, loginUser };
