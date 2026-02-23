import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      name: name || username,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Registration successful!", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Login attempt:", { username, email, password: "***" });

    // User can login with username or email
    let user;
    if (username) {
      user = await User.findOne({ username });
      console.log("User found by username:", user ? "Yes" : "No");
    } else if (email) {
      user = await User.findOne({ email });
      console.log("User found by email:", user ? "Yes" : "No");
    } else {
      return res.status(400).json({ message: "Username or email is required" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    console.log("Comparing passwords...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful!", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};