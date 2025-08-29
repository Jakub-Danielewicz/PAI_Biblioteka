const User = require("./models/User.js");
const Book = require("./models/Book.js");
const Copy = require("./models/BookCopy.js");
const Review = require("./models/Review.js");
const Order = require("./models/Order.js");
const setupRelations = require('./models/relations');
const sequelize = require('./database_config');

async function test() {
  setupRelations();
  await sequelize.sync({ force: true });
  console.log('Database synced');

  // Create users
  const user1 = await User.create({ username: 'alice', password: 'secret' });
  const user2 = await User.create({ username: 'bob', password: 'password' });

  // Create books
  const book1 = await Book.create({
    ISBN_13: 9781234567897,
    Title: 'Sequelize for Beginners',
    Author: 'John Doe',
    Publisher: 'Tech Books',
    Release_Date: '2023-01-01',
  });
  const book2 = await Book.create({
    ISBN_13: 9789876543210,
    Title: 'Advanced Node.js',
    Author: 'Jane Smith',
    Publisher: 'Code Press',
    Release_Date: '2024-02-15',
  });

  // Create copies for books (IMPORTANT: use book_ISBN, NOT book_id)
  const copy1 = await Copy.create({ book_ISBN: book1.ISBN_13, status: 'available' });
  const copy2 = await Copy.create({ book_ISBN: book1.ISBN_13, status: 'available' });
  const copy3 = await Copy.create({ book_ISBN: book2.ISBN_13, status: 'available' });

  // Create orders (user borrows copies)
  await Order.create({ user_id: user1.id, copy_id: copy1.id, start_date: '2025-05-01', status: 'active' });
  await Order.create({ user_id: user2.id, copy_id: copy3.id, start_date: '2025-05-10', status: 'active' });

  // Create reviews
  await Review.create({ author_id: user1.id, book_ISBN: book1.ISBN_13, rating: 5, content: 'Great book!' });
  await Review.create({ author_id: user2.id, book_ISBN: book2.ISBN_13, rating: 4, content: 'Very informative.' });

  // Query and print books with copies and orders
  const books = await Book.findAll({
    include: [
      { model: Copy, include: [Order] },
      { model: Review, include: [User] }
    ],
  });

  console.log('\nBooks with copies, orders, and reviews:\n');
  for (const book of books) {
    console.log(`Book: ${book.Title} (ISBN: ${book.ISBN_13})`);
    console.log('Copies:');
    for (const copy of book.Copies) {
      console.log(`  Copy ID: ${copy.id}, Status: ${copy.status}`);
      for (const order of copy.Orders) {
        console.log(`    Order ID: ${order.id}, User ID: ${order.user_id}, Status: ${order.status}`);
      }
    }
    console.log('Reviews:');
    for (const review of book.Reviews) {
      console.log(`  Review by ${review.User.username}: Rating ${review.rating}, Content: "${review.content}"`);
    }
    console.log('---');
  }

  // Test cascade delete: Delete book1 and verify copies deleted
  console.log('\nDeleting book:', book1.Title);
  await book1.destroy();

  // Check copies after deletion
  const copiesAfterDelete = await Copy.findAll({ where: { book_ISBN: book1.ISBN_13 } });
  console.log(`Copies left for deleted book (should be 0): ${copiesAfterDelete.length}`);

  // Check orders on deleted book copies (should be deleted too)
  const ordersAfterDelete = await Order.findAll();
  console.log(`Orders left after deleting book1 (should NOT include orders for book1 copies): ${ordersAfterDelete.length}`);

  // Try deleting a copy directly
  console.log('\nDeleting copy ID:', copy3.id);
  await copy3.destroy();

  const copy3AfterDelete = await Copy.findByPk(copy3.id);
  console.log(`Copy 3 exists after delete? ${copy3AfterDelete ? 'Yes' : 'No'}`);

  // Orders referencing deleted copy should be deleted by cascade
  const ordersAfterCopyDelete = await Order.findAll();
  console.log(`Orders left after deleting copy3: ${ordersAfterCopyDelete.length}`);

  await sequelize.close();
}

test().catch(console.error);
