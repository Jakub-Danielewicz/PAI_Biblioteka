import { Review, Book, User } from "../models/index.js";


export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;


    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      where: { bookId, userId: req.user.id }
    });

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this book" });
    }

    const review = await Review.create({
      rating,
      comment: comment || "",
      userId: req.user.id,
      bookId,
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ["id", "name"] }]
    });

    res.status(201).json(reviewWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.findAll({
      where: { bookId },
      include: [{ model: User, as: 'user', attributes: ["id", "name"] }],
      order: [["id", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
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
