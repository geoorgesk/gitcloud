import express from 'express';
import passport from 'passport';
import { register, login, githubCallback, saveGithubToken, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
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

export default router;