import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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