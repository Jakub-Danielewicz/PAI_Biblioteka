import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/", authenticate, updateUser);
router.delete("/", authenticate, deleteUser);

export default router;