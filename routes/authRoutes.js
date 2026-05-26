import express from 'express';
import passport from 'passport';
import { githubCallback, saveGithubToken, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/github-token', protect, saveGithubToken);

router.get('/github', passport.authenticate('github', {
  scope: ['user:email', 'repo'],
  session: false,
}));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  githubCallback
);

// Reject email/password register and login attempts
router.post('/register', (req, res) => {
  res.status(403).json({ message: 'Registration is only available through GitHub. Please use GitHub login.' });
});

router.post('/login', (req, res) => {
  res.status(403).json({ message: 'Login is only available through GitHub. Please use GitHub login.' });
});

export default router;