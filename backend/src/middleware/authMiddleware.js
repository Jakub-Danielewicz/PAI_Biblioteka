import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersekretnyklucz";

export const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists in database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Add fresh user data to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
