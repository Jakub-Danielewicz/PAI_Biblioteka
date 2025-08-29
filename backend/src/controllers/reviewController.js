import { Review, Book, User } from "../models/index.js";


export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.create({
      rating,
      comment,
      userId: req.user.id,
      bookId,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Nie udało się dodać recenzji" });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.findAll({
      where: { bookId },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Nie udało się pobrać recenzji" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Recenzja nie istnieje" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Nie możesz usunąć cudzej recenzji" });
    }

    await review.destroy();
    res.json({ message: "Recenzja usunięta" });
  } catch (err) {
    res.status(500).json({ error: "Nie udało się usunąć recenzji" });
  }
};
