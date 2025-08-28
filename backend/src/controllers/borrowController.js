import { Copy, User, Borrow } from '../models/index.js';
import { Op } from 'sequelize';

// POST /borrow { userId, copyId }
export async function borrowCopy(req, res) {
  const { userId, copyId } = req.body;
  if (!userId || !copyId) {
    return res.status(400).json({ error: 'userId and copyId are required' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const copy = await Copy.findByPk(copyId);
    if (!copy) {
      return res.status(404).json({ error: 'Copy not found' });
    }
    if (copy.status !== 'available') {
      return res.status(400).json({ error: 'Copy is not available' });
    }

    await Borrow.create({
      userId,
      copyId,
      borrowedAt: new Date(),
      returnedAt: null,
    });
    copy.status = 'borrowed';
    await copy.save();

    return res.json({ message: 'Copy borrowed successfully', copy });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

// POST /return { userId, copyId }
export async function returnCopy(req, res) {
  const { userId, copyId } = req.body;
  if (!userId || !copyId) {
    return res.status(400).json({ error: 'userId and copyId are required' });
  }
  try {
    const borrow = await Borrow.findOne({
      where: {
        userId,
        copyId,
        returnedAt: null,
      },
    });
    if (!borrow) {
      return res.status(404).json({ error: 'Active borrow not found' });
    }
    borrow.returnedAt = new Date();
    await borrow.save();
    const copy = await Copy.findByPk(copyId);
    if (copy) {
      copy.status = 'available';
      await copy.save();
    }
    return res.json({ message: 'Copy returned successfully', borrow });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

// GET /borrows?userId=...&bookId=...
export async function getBorrows(req, res) {
  const { userId, bookId } = req.query;
  const where = {};
  if (userId) where.userId = userId;
  if (bookId) where['$copy.ISBN_13$'] = bookId;
  try {
    const borrows = await Borrow.findAll({
      where,
      include: [
        { model: Copy, as: 'copy' },
        { model: User, as: 'user' },
      ],
    });
    return res.json(borrows);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
