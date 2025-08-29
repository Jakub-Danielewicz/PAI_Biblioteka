import express from "express";
import { updateUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/", authenticate, updateUser);

export default router;