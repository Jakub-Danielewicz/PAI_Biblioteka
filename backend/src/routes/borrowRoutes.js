import express from 'express';
import { borrowCopy, returnCopy, getBorrows } from '../controllers/borrowController.js';

const router = express.Router();

router.post('/borrow', borrowCopy);
router.post('/return', returnCopy);
router.get('/borrows', getBorrows);

export default router;
