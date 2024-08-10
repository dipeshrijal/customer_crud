const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/jwt");
const logger = require("../config/logger");

class AuthController {
  static async register(req, res) {
    const { email, password, fullName } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn("User already exists with email:", { email });
        return res.status(409).json({ message: "User already exists" });
      }

      const user = new User({ email, password, fullName });
      await user.save();

      const token = createToken({ id: user._id, email: user.email });
      logger.info("User registered successfully:", { email });
      res.status(201).json({ token });
    } catch (err) {
      logger.error("Error registering user:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        logger.warn("User not found with email:", { email });
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.warn("Invalid credentials for email:", { email });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = createToken({ id: user._id, email: user.email });
      logger.info("User logged in successfully:", { email });
      res.status(200).json({ token });
    } catch (err) {
      logger.error("Error logging in user:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = AuthController;
