import express from 'express';
import { borrowCopy, returnCopy, getBorrows, updateBorrow } from '../controllers/borrowController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/borrows', authenticate, borrowCopy);
router.get('/borrows', authenticate, getBorrows);
router.patch('/borrows/:id', authenticate, updateBorrow);
router.patch('/borrows/:id/return', authenticate, returnCopy);

export default router;
