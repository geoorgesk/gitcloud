import Photo from '../models/Photo.js';
import Album from '../models/Album.js';
import Repository from '../models/Repository.js';

export const getStats = async (req, res) => {
  const userId = req.user._id;

  const totalPhotos = await Photo.countDocuments({ userId });
  const totalAlbums = await Album.countDocuments({ userId });
  const photos = await Photo.find({ userId });
  const totalSize = photos.reduce((acc, p) => acc + p.size, 0);
  const repos = await Repository.find();
  const activeRepo = repos.find(r => r.isActive);

  res.json({
    totalPhotos,
    totalAlbums,
    totalSize,
    totalRepos: repos.length,
    activeRepo: activeRepo?.repoName || 'gitcloud-storage-1',
    activeRepoSize: activeRepo?.currentSize || 0,
  });
};