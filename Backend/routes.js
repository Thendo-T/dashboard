const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getActiveUsers,
  getNewUsersLastWeek,
  getTotalUsers,
  getLoggedInUserName,
} = require("./authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/active-users", getActiveUsers);
router.get("/new-signups", getNewUsersLastWeek);
router.get("/total-users", getTotalUsers);
router.post("/logged-in-user-name", getLoggedInUserName);

module.exports = router;
