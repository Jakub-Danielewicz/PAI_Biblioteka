import express from "express";
import { updateUser, deleteUser, getAllUsers, deleteUserById } from "../controllers/userController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, requireAdmin, getAllUsers);
router.put("/", authenticate, updateUser);
router.delete("/", authenticate, deleteUser);
router.delete("/:id", authenticate, requireAdmin, deleteUserById);

export default router;