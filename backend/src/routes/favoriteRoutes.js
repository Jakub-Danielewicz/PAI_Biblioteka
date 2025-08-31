import express from 'express';
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, addFavorite);
router.delete('/:bookId', authenticate, removeFavorite);
router.get('/', authenticate, getFavorites);
router.get('/check/:bookId', authenticate, checkFavorite);

export default router;