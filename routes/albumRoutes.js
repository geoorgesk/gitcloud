import express from 'express';
import { createAlbum, getAlbums, updateAlbum, deleteAlbum } from '../controllers/albumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.post('/', createAlbum);
router.get('/', getAlbums);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;