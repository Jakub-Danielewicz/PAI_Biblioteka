import { Book, Copy } from '../models/index.js';

const bookController = {
  async getAll(req, res) {
    try {
      // Pobierz parametry filtracji i paginacji
      const { page = 1, limit = 10, ...filters } = req.query;
      const where = {};
      // Filtracja po wszystkich polach modelu Book
      for (const key of Object.keys(Book.rawAttributes)) {
        if (filters[key]) {
          where[key] = filters[key];
        }
      }
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const books = await Book.findAndCountAll({
        where,
        include: 'copies',
        limit: parseInt(limit),
        offset,
      });
      res.json({
        total: books.count,
        page: parseInt(page),
        limit: parseInt(limit),
        data: books.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const book = await Book.findByPk(req.params.ISBN_13, { include: 'copies' });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Book.update(req.body, {
        where: { ISBN_13: req.params.ISBN_13 },
      });
      if (!updated) return res.status(404).json({ error: 'Book not found' });
      const book = await Book.findByPk(req.params.ISBN_13);
      res.json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Book.destroy({ where: { ISBN_13: req.params.ISBN_13 } });
      if (!deleted) return res.status(404).json({ error: 'Book not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
export default bookController;
