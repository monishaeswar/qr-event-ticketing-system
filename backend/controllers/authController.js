const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_EXPIRY } = require('../utils/constants');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: JWT_EXPIRY });

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe, generateToken };
