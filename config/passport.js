import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/github/callback',
  scope: ['user:email', 'repo'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (user) {
      user.githubToken = accessToken;
      user.avatar = profile.photos?.[0]?.value;
      await user.save();
      return done(null, user);
    }

    const email = profile.emails?.[0]?.value;
    let username = profile.username;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      username = `${username}_${Date.now()}`;
    }

    user = await User.create({
      username,
      email,
      githubId: profile.id,
      githubUsername: profile.username,
      githubToken: accessToken,
      avatar: profile.photos?.[0]?.value,
      authType: 'github',
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

export default passport;