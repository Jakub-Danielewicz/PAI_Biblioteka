import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import { authenticate } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(bookRoutes);
app.use(borrowRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Backend Express działa!');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
});
