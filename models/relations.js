const User = require("./User.js");
const Book = require("./Book.js");
const BookCopy = require("./BookCopy.js");
const Review = require("./Review.js");
const Order = require("./Order.js");

async function setupRelations() {

    User.hasMany(Review, { foreignKey: 'author_id' });
    Review.belongsTo(User, { foreignKey: 'author_id' });

    Book.hasMany(Review, { foreignKey: 'book_ISBN', sourceKey: 'ISBN_13' });
    Review.belongsTo(Book, { foreignKey: 'book_ISBN', targetKey: 'ISBN_13' });

    User.hasMany(Order, { foreignKey: 'user_id' });
    Order.belongsTo(User, { foreignKey: 'user_id' });

    Book.hasMany(BookCopy, { foreignKey: 'book_ISBN', sourceKey: 'ISBN_13', onDelete: 'CASCADE' });
    BookCopy.belongsTo(Book, { foreignKey: 'book_ISBN', targetKey: 'ISBN_13' });

    BookCopy.hasMany(Order, { foreignKey: 'copy_id' });
    Order.belongsTo(BookCopy, { foreignKey: 'copy_id' });
}

module.exports = setupRelations;
