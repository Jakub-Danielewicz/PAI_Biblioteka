import { sequelize, Book, Copy, User, Borrow, Review, Favorite } from './models/index.js';
import bcrypt from 'bcrypt';

const mockBooks = [
  {
    ISBN_13: '9780134685991',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    publisher: 'Addison-Wesley Professional',
    year: 2017,
    description: 'Przewodnik po najlepszych praktykach programowania w Javie. Książka zawiera 90 praktycznych rad dotyczących pisania lepszego kodu.'
  },
  {
    ISBN_13: '9781617294563',
    title: 'Spring in Action',
    author: 'Craig Walls',
    publisher: 'Manning Publications',
    year: 2018,
    description: 'Kompletny przewodnik po frameworku Spring. Nauczy Cię budować aplikacje Java z wykorzystaniem najnowszych funkcji Spring.'
  },
  {
    ISBN_13: '9780596007126',
    title: 'The Cathedral & the Bazaar',
    author: 'Eric S. Raymond',
    publisher: 'O\'Reilly Media',
    year: 2001,
    description: 'Klasyka literatury o rozwoju oprogramowania open source. Analiza dwóch różnych modeli rozwoju oprogramowania.'
  },
  {
    ISBN_13: '9780201633610',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    publisher: 'Addison-Wesley Professional',
    year: 1994,
    description: 'Fundamentalna książka o wzorcach projektowych w programowaniu obiektowym. Biblia każdego programisty.'
  },
  {
    ISBN_13: '9780132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    year: 2008,
    description: 'Przewodnik po pisaniu czytelnego, łatwego w utrzymaniu kodu. Podstawowe zasady dobrego programowania.'
  },
  {
    ISBN_13: '9781449331818',
    title: 'Learning React',
    author: 'Alex Banks',
    publisher: 'O\'Reilly Media',
    year: 2020,
    description: 'Praktyczny przewodnik po bibliotece React. Nauczy Cię budować nowoczesne aplikacje webowe.'
  },
  {
    ISBN_13: '9781491950296',
    title: 'Building Microservices',
    author: 'Sam Newman',
    publisher: 'O\'Reilly Media',
    year: 2015,
    description: 'Przewodnik po architekturze mikrousług. Wszystko co musisz wiedzieć o projektowaniu i wdrażaniu mikrousług.'
  },
  {
    ISBN_13: '9780135166307',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    publisher: 'Addison-Wesley Professional',
    year: 2019,
    description: 'Klasyka literatury programistycznej. Praktyczne rady dla każdego programisty, niezależnie od języka i technologii.'
  }
];

const mockUsers = [
  {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    password: 'password123'
  },
  {
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com',
    password: 'password123'
  },
  {
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    password: 'password123'
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await sequelize.sync({ force: true });

    // Insert books
    console.log('Inserting books...');
    await Book.bulkCreate(mockBooks);

    // Insert users with hashed passwords
    console.log('Inserting users...');
    const usersWithHashedPasswords = await Promise.all(
      mockUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    await User.bulkCreate(usersWithHashedPasswords);

    // Insert copies for each book
    console.log('Inserting book copies...');
    for (let i = 0; i < mockBooks.length; i++) {
      const book = mockBooks[i];
      if (i === 0) {
        // First book - all copies borrowed (fully unavailable)
        await Copy.bulkCreate([
          { ISBN_13: book.ISBN_13, status: 'borrowed', borrowedBy: 1 },
          { ISBN_13: book.ISBN_13, status: 'borrowed', borrowedBy: 2 },
          { ISBN_13: book.ISBN_13, status: 'borrowed', borrowedBy: 3 }
        ]);
      } else if (i === 1) {
        // Second book (Spring in Action) - no copies at all
        // Skip adding copies for this book
      } else {
        // Other books - normal distribution
        await Copy.bulkCreate([
          { ISBN_13: book.ISBN_13, status: 'available' },
          { ISBN_13: book.ISBN_13, status: 'available' },
          { ISBN_13: book.ISBN_13, status: 'borrowed', borrowedBy: 1 }
        ]);
      }
    }

    // Insert borrows (including overdue ones)
    console.log('Inserting borrows...');
    const now = new Date();
    const overdueDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago
    const futureDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days from now
    const recentPast = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 days ago
    
    await Borrow.bulkCreate([
      // Fully borrowed book - "Effective Java" (first book, copyIds 1,2,3)
      {
        userId: 1,
        copyId: 1,
        borrowedAt: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000)),
        dueDate: new Date(now.getTime() + (20 * 24 * 60 * 60 * 1000)),
        returnedAt: null
      },
      {
        userId: 2,
        copyId: 2,
        borrowedAt: new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)),
        dueDate: new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)),
        returnedAt: null
      },
      {
        userId: 3,
        copyId: 3,
        borrowedAt: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)),
        dueDate: new Date(now.getTime() + (25 * 24 * 60 * 60 * 1000)),
        returnedAt: null
      },
      // Overdue borrow
      {
        userId: 1,
        copyId: 9, // Different book
        borrowedAt: new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000)),
        dueDate: overdueDate,
        returnedAt: null
      },
      // Active borrow
      {
        userId: 2,
        copyId: 12, // Different book
        borrowedAt: recentPast,
        dueDate: futureDate,
        returnedAt: null
      },
      // Returned borrow
      {
        userId: 3,
        copyId: 15, // Different book
        borrowedAt: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
        dueDate: new Date(now.getTime() - (16 * 24 * 60 * 60 * 1000)),
        returnedAt: new Date(now.getTime() - (18 * 24 * 60 * 60 * 1000))
      },
      // Anna Nowak overdue borrow
      {
        userId: 2,
        copyId: 18, // Different book
        borrowedAt: new Date(now.getTime() - (25 * 24 * 60 * 60 * 1000)),
        dueDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)), // 5 days overdue
        returnedAt: null
      }
    ]);

    // Insert reviews
    console.log('Inserting reviews...');
    await Review.bulkCreate([
      {
        userId: 1,
        bookId: '9780134685991',
        rating: 5,
        comment: 'Fantastyczna książka! Każdy programista Java powinien ją przeczytać. Zawiera mnóstwo praktycznych porad.',
        createdAt: new Date()
      },
      {
        userId: 2,
        bookId: '9780134685991',
        rating: 4,
        comment: 'Bardzo dobra pozycja, choć miejscami nieco zawiła. Polecam szczególnie doświadczonym programistom.',
        createdAt: new Date()
      },
      {
        userId: 3,
        bookId: '9780132350884',
        rating: 5,
        comment: 'Clean Code to must-have dla każdego developera. Zmieniła moje podejście do pisania kodu.',
        createdAt: new Date()
      },
      {
        userId: 1,
        bookId: '9781449331818',
        rating: 4,
        comment: 'Dobry przewodnik po React, aktualne przykłady i jasne wyjaśnienia.',
        createdAt: new Date()
      },
      {
        userId: 2,
        bookId: '9780201633610',
        rating: 5,
        comment: 'Biblia wzorców projektowych. Trudna, ale nieoceniona w codziennej pracy.',
        createdAt: new Date()
      }
    ]);

    // Insert favorites
    console.log('Inserting favorites...');
    await Favorite.bulkCreate([
      { userId: 1, bookId: '9780134685991' },
      { userId: 1, bookId: '9780132350884' },
      { userId: 2, bookId: '9781449331818' },
      { userId: 2, bookId: '9780201633610' },
      { userId: 3, bookId: '9780132350884' }
    ]);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run seeding if called directly
if (process.argv[2] === 'seed') {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
