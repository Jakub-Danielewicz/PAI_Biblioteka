import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersekretnyklucz";

export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Brak tokenu" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Nieprawidłowy token" });
  }
};
