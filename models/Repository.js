import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  repoName:    { type: String, required: true, unique: true },
  currentSize: { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Repository', repositorySchema);