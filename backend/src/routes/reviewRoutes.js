import express from "express";
import { addReview, getReviewsByBook, deleteReview } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:bookId", authenticate, addReview);
router.get("/:bookId", authenticate, getReviewsByBook);
router.delete("/:id", authenticate, deleteReview);

export default router;
