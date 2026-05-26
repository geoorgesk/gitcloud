import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, lowercase: true },
  passwordHash: { type: String },
  githubId: { type: String, unique: true, sparse: true },
  githubUsername: { type: String },
  githubToken: { type: String },
  avatar: { type: String },
  authType: { type: String, enum: ['github'], default: 'github' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);