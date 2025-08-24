import { Copy, Book } from '../models/index.js';

const copyController = {
  async getAll(req, res) {
    try {
      const copies = await Copy.findAll({ where: { ISBN_13: req.params.ISBN_13 }, include: 'book' });
      res.json(copies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const copy = await Copy.findOne({
        where: { id: req.params.id, ISBN_13: req.params.ISBN_13 },
        include: 'book',
      });
      if (!copy) return res.status(404).json({ error: 'Copy not found' });
      res.json(copy);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const copy = await Copy.create({ ...req.body, ISBN_13: req.params.ISBN_13 });
      res.status(201).json(copy);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Copy.update(req.body, {
        where: { id: req.params.id, ISBN_13: req.params.ISBN_13 },
      });
      if (!updated) return res.status(404).json({ error: 'Copy not found' });
      const copy = await Copy.findOne({ where: { id: req.params.id, ISBN_13: req.params.ISBN_13 } });
      res.json(copy);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Copy.destroy({ where: { id: req.params.id, ISBN_13: req.params.ISBN_13 } });
      if (!deleted) return res.status(404).json({ error: 'Copy not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
export default copyController;
