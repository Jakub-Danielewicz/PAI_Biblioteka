import Sequelize from 'sequelize';
import bookModel from './book.js';
import copyModel from './copy.js';
import userModel from './user.js';
import borrowModel from './borrow.js';

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || 'sqlite:./database.sqlite');

const Book = bookModel(sequelize);
const Copy = copyModel(sequelize);
const User = userModel(sequelize);
const Borrow = borrowModel(sequelize);

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
Copy.belongsTo(User, {
  foreignKey: 'borrowedBy',
  targetKey: 'id',
  as: 'borrower',
});
Copy.hasMany(Borrow, { foreignKey: 'copyId', as: 'borrows' });
User.hasMany(Borrow, { foreignKey: 'userId', as: 'borrows' });
Borrow.belongsTo(Copy, { foreignKey: 'copyId', as: 'copy' });
Borrow.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, Book, Copy, User, Borrow };
