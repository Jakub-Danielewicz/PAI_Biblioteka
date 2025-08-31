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

// PATCH /borrows/:id { dueDate }
export async function updateBorrow(req, res) {
  const { id } = req.params;
  const { dueDate } = req.body;
  
  if (!dueDate) {
    return res.status(400).json({ error: 'dueDate is required' });
  }

  try {
    const borrow = await Borrow.findOne({
      where: {
        id: id,
        userId: req.user.id,
        returnedAt: null,
      },
      include: [{ model: Copy, as: 'copy', include: [{ model: Book, as: 'book' }] }]
    });

    if (!borrow) {
      return res.status(404).json({ error: 'Active borrow not found' });
    }

    const newDueDate = new Date(dueDate);
    const currentDueDate = new Date(borrow.dueDate);
    
    if (newDueDate <= currentDueDate) {
      return res.status(400).json({ error: 'New due date must be later than current due date' });
    }

    // Check max 60 days from original borrow
    const borrowDate = new Date(borrow.borrowedAt);
    const maxDueDate = new Date();
    maxDueDate.setDate(borrowDate.getDate() + 60);
    
    if (newDueDate > maxDueDate) {
      return res.status(400).json({ error: 'Cannot extend beyond 60 days from original borrow date' });
    }

    // Check availability during extension period
    const conflictingBorrows = await Borrow.findAll({
      where: {
        id: { [Op.ne]: id },
        returnedAt: null,
      },
      include: [{ model: Copy, as: 'copy', where: { ISBN_13: borrow.copy.ISBN_13 } }]
    });

    const hasConflict = conflictingBorrows.some(cb => {
      const cbDueDate = new Date(cb.dueDate);
      return cbDueDate > currentDueDate && cbDueDate <= newDueDate;
    });

    if (hasConflict) {
      return res.status(400).json({ 
        error: 'Book not available during requested period' 
      });
    }

    borrow.dueDate = newDueDate;
    await borrow.save();

    return res.json({ message: 'Rental extended successfully', borrow });
  } catch (err) {
    console.error('Error updating borrow:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PATCH /borrows/:id/return
export async function returnCopy(req, res) {
  const borrowId = req.params.id;
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
  let where;

  // Jeśli użytkownik ma ID 1, zwracamy wszystko
  if (req.user.id === 1) {
    where = {};
  } else {
    where = { userId: req.user.id };
  }

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

    // Fetch book data manually jeśli nested include nie działa
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
