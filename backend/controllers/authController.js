const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isDatabaseConnected = require("../utils/isDatabaseConnected");
const { getUserByEmail, createUser } = require("../utils/localStore");
const { JWT_SECRET } = require("../config/env");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    let existingUser;

    if (isDatabaseConnected()) {
      existingUser = await User.findOne({ email: normalizedEmail });
    } else {
      existingUser = getUserByEmail(normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (isDatabaseConnected()) {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });
    } else {
      user = createUser({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user;

    if (isDatabaseConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = getUserByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected profile fetched successfully",
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
