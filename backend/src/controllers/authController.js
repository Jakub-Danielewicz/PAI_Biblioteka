import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersekretnyklucz";

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;

    const existingUser = await User.findOne({ where: { name } });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, password: hashedPassword });

    res.status(201).json({ message: "Użytkownik zarejestrowany", user: { id: user.id, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

export const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy login lub hasło" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Nieprawidłowy login lub hasło" });
    }

    const token = jwt.sign({ id: user.id, name: user.rname }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};
