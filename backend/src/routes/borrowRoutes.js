import express from 'express';
import { borrowCopy, returnCopy, getBorrows } from '../controllers/borrowController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/borrow', authenticate, borrowCopy);
router.post('/return', authenticate, returnCopy);
router.get('/borrows', authenticate, getBorrows);

export default router;
