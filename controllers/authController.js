import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    passwordHash,
    authType: 'local'
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    authType: user.authType,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });

  if (user.authType === 'github')
    return res.status(401).json({ message: 'Please login with GitHub' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    authType: user.authType,
    token: generateToken(user._id),
  });
};

export const githubCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&username=${req.user.username}&userId=${req.user._id}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_failed`);
  }
};

export const saveGithubToken = async (req, res) => {
  const { githubToken } = req.body;
  if (!githubToken)
    return res.status(400).json({ message: 'GitHub token is required' });

  await User.findByIdAndUpdate(req.user._id, { githubToken });
  res.json({ message: 'GitHub token saved successfully' });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash -githubToken');
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    githubUsername: user.githubUsername,
    avatar: user.avatar,
    authType: user.authType,
    hasGithubToken: !!user.githubToken,
  });
};