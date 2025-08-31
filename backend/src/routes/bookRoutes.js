import express from 'express';
import bookController from '../controllers/bookController.js';
import copyController from '../controllers/copyController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Books CRUD
router.get('/books', authenticate, bookController.getAll);
router.get('/books/:ISBN_13', authenticate, bookController.getOne);
router.post('/books', authenticate, requireAdmin, bookController.create);
router.put('/books/:ISBN_13', authenticate, requireAdmin, bookController.update);
router.delete('/books/:ISBN_13',authenticate, requireAdmin,  bookController.delete);

// Copies CRUD (nested under books)
router.get('/books/:ISBN_13/copies', authenticate, copyController.getAll);
router.get('/books/:ISBN_13/copies/:id', authenticate, copyController.getOne);
router.post('/books/:ISBN_13/copies', authenticate, requireAdmin, copyController.create);
router.put('/books/:ISBN_13/copies/:id', authenticate, requireAdmin, copyController.update);
router.delete('/books/:ISBN_13/copies/:id', authenticate, requireAdmin, copyController.delete);

export default router;
