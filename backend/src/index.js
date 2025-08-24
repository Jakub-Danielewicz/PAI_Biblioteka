import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Express działa!');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
});
