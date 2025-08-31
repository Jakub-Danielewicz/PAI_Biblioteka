import { User, Borrow, Review } from "../models/index.js";
import bcrypt from 'bcrypt';

export const updateUser = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = name.trim();
    }

    if (newPassword !== undefined) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to update password" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await user.update(updates);

    res.json({
      message: "User updated successfully",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Check for active borrows
    const activeBorrows = await Borrow.count({
      where: { 
        userId, 
        returnedAt: null 
      }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        message: "Cannot delete account with active book borrows. Please return all borrowed books first." 
      });
    }

    // Delete user's reviews first (due to foreign key constraints)
    await Review.destroy({ where: { userId } });
    
    // Delete user's borrow history
    await Borrow.destroy({ where: { userId } });
    
    // Delete the user account
    await user.destroy();

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};