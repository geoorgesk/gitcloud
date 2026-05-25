import Photo from '../models/Photo.js';
import { uploadToGitHub, deleteFromGitHub } from '../services/githubService.js';

export const uploadPhoto = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: 'No file uploaded' });

  const { buffer, originalname, mimetype, size } = req.file;
  const { albumId } = req.body;

  const result = await uploadToGitHub(buffer, originalname, mimetype, req.user._id);

  const photo = await Photo.create({
    filename: result.filename,
    githubUrl: result.url,
    repoName: result.repoName,
    fileSha: result.sha,
    size,
    userId: req.user._id,
    albumId: albumId || null,
  });

  res.status(201).json(photo);
};

export const getPhotos = async (req, res) => {
  const { albumId, search } = req.query;
  const query = { userId: req.user._id };

  if (albumId) query.albumId = albumId;
  if (search) query.filename = { $regex: search, $options: 'i' };

  const photos = await Photo.find(query).sort({ createdAt: -1 });
  res.json(photos);
};

export const deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo)
    return res.status(404).json({ message: 'Photo not found' });

  if (photo.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  await deleteFromGitHub(photo.repoName, photo.filename, photo.fileSha, req.user._id);
  await photo.deleteOne();

  res.json({ message: 'Photo deleted successfully' });
};

export const toggleFavorite = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: 'Photo not found' });
  photo.isFavorite = !photo.isFavorite;
  await photo.save();
  res.json(photo);
};

export const assignToAlbum = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: 'Photo not found' });
  if (photo.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  photo.albumId = req.body.albumId || null;
  await photo.save();
  res.json(photo);
};