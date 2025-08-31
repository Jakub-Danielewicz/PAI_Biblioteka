import express from 'express';
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, addFavorite);
router.get('/', authenticate, getFavorites);
router.get('/:bookId', authenticate, checkFavorite);
router.delete('/:bookId', authenticate, removeFavorite);

export default router;