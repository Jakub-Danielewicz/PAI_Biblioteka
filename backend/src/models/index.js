import Sequelize from 'sequelize';
import bookModel from './book.js';
import copyModel from './copy.js';

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || 'sqlite::memory:');

const Book = bookModel(sequelize);
const Copy = copyModel(sequelize);

Book.hasMany(Copy, {
  foreignKey: 'ISBN_13',
  sourceKey: 'ISBN_13',
  as: 'copies',
});
Copy.belongsTo(Book, {
  foreignKey: 'ISBN_13',
  targetKey: 'ISBN_13',
  as: 'book',
});

export { sequelize, Book, Copy };
