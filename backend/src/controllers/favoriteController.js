import { Favorite, Book, User, Copy } from '../models/index.js';

// POST /favorites { bookId }
export const addFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId is required' });
    }

    // Check if book exists
    const book = await Book.findOne({ where: { ISBN_13: bookId } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    if (existingFavorite) {
      return res.status(400).json({ error: 'Book is already in favorites' });
    }

    // Create favorite
    const favorite = await Favorite.create({
      userId,
      bookId
    });

    return res.status(201).json({ 
      message: 'Book added to favorites', 
      favorite 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /favorites/:bookId
export const removeFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId is required' });
    }

    // Find and delete favorite
    const favorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();

    return res.json({ message: 'Book removed from favorites' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Copy,
              as: 'copies'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /favorites/check/:bookId
export const checkFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    return res.json({ isFavorite: !!favorite });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};