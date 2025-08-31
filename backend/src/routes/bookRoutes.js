import express from 'express';
import bookController from '../controllers/bookController.js';
import copyController from '../controllers/copyController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Books CRUD
router.get('/books', bookController.getAll);
router.get('/books/:ISBN_13', bookController.getOne);
router.post('/books', authenticate, requireAdmin, bookController.create);
router.put('/books/:ISBN_13', authenticate, requireAdmin, bookController.update);
router.delete('/books/:ISBN_13',authenticate, requireAdmin,  bookController.delete);

// Copies CRUD (nested under books)
router.get('/books/:ISBN_13/copies', copyController.getAll);
router.get('/books/:ISBN_13/copies/:id', copyController.getOne);
router.post('/books/:ISBN_13/copies', copyController.create);
router.put('/books/:ISBN_13/copies/:id', copyController.update);
router.delete('/books/:ISBN_13/copies/:id', copyController.delete);

export default router;
