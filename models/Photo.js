import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  filename:   { type: String, required: true },
  githubUrl:  { type: String, required: true },
  repoName:   { type: String, required: true },
  fileSha:    { type: String, required: true },
  size:       { type: Number, required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  albumId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Photo', photoSchema);