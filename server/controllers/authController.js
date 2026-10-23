const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    res.status(400);
    throw new Error('This email is already registered');
  }
  // Role is never taken from the request: new accounts are always customers.
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(String(password || '')))) {
    res.status(401);
    throw new Error('Incorrect email or password');
  }
  res.json({ user: publicUser(user), token: generateToken(user._id) });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
