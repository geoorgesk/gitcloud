import express from 'express';
import { uploadPhoto, getPhotos, deletePhoto, toggleFavorite } from '../controllers/photoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.use(protect);
router.post('/upload', upload.single('photo'), uploadPhoto);
router.get('/', getPhotos);
router.delete('/:id', deletePhoto);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/album', assignToAlbum);

export default router;