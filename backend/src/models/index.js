import Sequelize from 'sequelize';
import bookModel from './book.js';
import copyModel from './copy.js';
import userModel from './user.js';
import borrowModel from './borrow.js';
import reviewModel from './review.js';

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || 'sqlite:./database.sqlite');

const Book = bookModel(sequelize);
const Copy = copyModel(sequelize);
const User = userModel(sequelize);
const Borrow = borrowModel(sequelize);
const Review = reviewModel(sequelize);

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

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews', sourceKey: 'ISBN_13' });
Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book', targetKey: 'ISBN_13' });

export { sequelize, Book, Copy, User, Borrow, Review };
