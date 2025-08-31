import { Copy, User, Borrow, Book } from '../models/index.js';
import { Op } from 'sequelize';

// POST /borrow { ISBN_13, returnDate }
export async function borrowCopy(req, res) {
  console.log('BORROW REQUEST:', req.body);
  console.log('USER:', req.user);
  
  const { ISBN_13, returnDate } = req.body;
  const userId = req.user.id;

  if (!ISBN_13 || !returnDate) {
    console.log('MISSING FIELDS:', { ISBN_13, returnDate });
    return res.status(400).json({ error: 'ISBN_13 and returnDate are required' });
  }

  try {
    // Check if user already has an active borrow for this book
    const existingBorrow = await Borrow.findOne({
      where: {
        userId,
        returnedAt: null
      },
      include: [
        {
          model: Copy,
          as: 'copy',
          where: {
            ISBN_13
          }
        }
      ]
    });

    if (existingBorrow) {
      return res.status(400).json({ error: 'You already have an active borrow for this book' });
    }

    // Find an available copy of the book
    const availableCopy = await Copy.findOne({
      where: {
        ISBN_13,
        status: 'available'
      }
    });

    if (!availableCopy) {
      return res.status(400).json({ error: 'No copies available for this book' });
    }

    // Validate return date (max 30 days from today)
    const today = new Date();
    const maxReturnDate = new Date();
    maxReturnDate.setDate(today.getDate() + 30);
    const selectedReturnDate = new Date(returnDate);

    if (selectedReturnDate < today || selectedReturnDate > maxReturnDate) {
      return res.status(400).json({ error: 'Return date must be between today and 30 days from now' });
    }

    // Create borrow record
    await Borrow.create({
      userId,
      copyId: availableCopy.id,
      borrowedAt: new Date(),
      returnedAt: null,
      dueDate: selectedReturnDate,
    });

    // Update copy status and set borrowedBy
    availableCopy.status = 'borrowed';
    availableCopy.borrowedBy = userId;
    await availableCopy.save();

    return res.json({ 
      message: 'Book borrowed successfully', 
      copy: availableCopy,
      returnDate: selectedReturnDate
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /return { borrowId }
export async function returnCopy(req, res) {
  const { borrowId } = req.body;
  if (!borrowId) {
    return res.status(400).json({ error: 'borrowId is required' });
  }
  try {
    const borrow = await Borrow.findOne({
      where: {
        id: borrowId,
        userId: req.user.id,
        returnedAt: null,
      },
      include: [
        { model: Copy, as: 'copy' }
      ]
    });
    if (!borrow) {
      return res.status(404).json({ error: 'Active borrow not found' });
    }
    
    borrow.returnedAt = new Date();
    await borrow.save();
    
    const copy = borrow.copy;
    if (copy) {
      copy.status = 'available';
      copy.borrowedBy = null;
      await copy.save();
    }
    
    return res.json({ message: 'Book returned successfully', borrow });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

// GET /borrows?userId=...&bookId=...
export async function getBorrows(req, res) {
  const { userId, bookId } = req.query;
  const where = { userId: req.user.id };
  if (userId) where.userId = userId;
  if (bookId) where['$copy.ISBN_13$'] = bookId;
  try {
    const borrows = await Borrow.findAll({
      where,
      include: [
        { 
          model: Copy, 
          as: 'copy',
          include: [
            { 
              model: Book, 
              as: 'book',
              required: false
            }
          ]
        },
        { model: User, as: 'user' },
      ],
    });

    // If the nested include doesn't work, let's fetch book data manually
    const borrowsWithBooks = await Promise.all(
      borrows.map(async (borrow) => {
        const book = await Book.findOne({ where: { ISBN_13: borrow.copy.ISBN_13 } });
        return {
          ...borrow.toJSON(),
          copy: {
            ...borrow.copy.toJSON(),
            book: book ? book.toJSON() : null
          }
        };
      })
    );

    return res.json(borrowsWithBooks);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
