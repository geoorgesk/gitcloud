import Album from '../models/Album.js';
import Photo from '../models/Photo.js';

export const createAlbum = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Album name required' });

  const album = await Album.create({ name, userId: req.user._id });
  res.status(201).json(album);
};

export const getAlbums = async (req, res) => {
  const albums = await Album.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(albums);
};

export const updateAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).json({ message: 'Album not found' });

  album.name = req.body.name || album.name;
  await album.save();
  res.json(album);
};

export const deleteAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).json({ message: 'Album not found' });

  await Photo.updateMany({ albumId: album._id }, { albumId: null });
  await album.deleteOne();
  res.json({ message: 'Album deleted' });
};