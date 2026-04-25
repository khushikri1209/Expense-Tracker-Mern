// controllers/authController.js - Register and Login logic

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: generate a signed JWT token for the given user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper: validate that a value is a non-empty string (guards against NoSQL injection)
const isString = (v) => typeof v === 'string' && v.trim().length > 0;

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate types to prevent NoSQL injection via object payloads
  if (!isString(name) || !isString(email) || !isString(password)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Check if user already exists (email is coerced to string for safety)
    const userExists = await User.findOne({ email: String(email).toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password is hashed in the model pre-save hook)
    const user = await User.create({ name: String(name).trim(), email: String(email).toLowerCase(), password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user and return JWT
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate types to prevent NoSQL injection via object payloads
  if (!isString(email) || !isString(password)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Find user by email (coerce to string for safety)
    const user = await User.findOne({ email: String(email).toLowerCase() });

    // Validate user and password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current logged-in user profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = { registerUser, loginUser, getMe };
