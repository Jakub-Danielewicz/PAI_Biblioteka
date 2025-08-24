import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import bookRoutes from './routes/bookRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(bookRoutes);

app.get('/', (req, res) => {
  res.send('Backend Express działa!');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
});
