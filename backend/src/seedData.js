import { sequelize, Book, Copy, User } from './models/index.js';

const mockBooks = [
  {
    ISBN_13: '9780134685991',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    publisher: 'Addison-Wesley Professional',
    year: 2017
  },
  {
    ISBN_13: '9781617294563',
    title: 'Spring in Action',
    author: 'Craig Walls',
    publisher: 'Manning Publications',
    year: 2018
  },
  {
    ISBN_13: '9780596007126',
    title: 'The Cathedral & the Bazaar',
    author: 'Eric S. Raymond',
    publisher: 'O\'Reilly Media',
    year: 2001
  },
  {
    ISBN_13: '9780201633610',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    publisher: 'Addison-Wesley Professional',
    year: 1994
  },
  {
    ISBN_13: '9780132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    year: 2008
  },
  {
    ISBN_13: '9781449331818',
    title: 'Learning React',
    author: 'Alex Banks',
    publisher: 'O\'Reilly Media',
    year: 2020
  },
  {
    ISBN_13: '9781491950296',
    title: 'Building Microservices',
    author: 'Sam Newman',
    publisher: 'O\'Reilly Media',
    year: 2015
  },
  {
    ISBN_13: '9780135166307',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    publisher: 'Addison-Wesley Professional',
    year: 2019
  }
];

const mockUsers = [
  {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com'
  },
  {
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com'
  },
  {
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@example.com'
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

    // Insert users
    console.log('Inserting users...');
    await User.bulkCreate(mockUsers);

    // Insert copies for each book
    console.log('Inserting book copies...');
    for (const book of mockBooks) {
      await Copy.bulkCreate([
        { ISBN_13: book.ISBN_13, status: 'available' },
        { ISBN_13: book.ISBN_13, status: 'available' },
        { ISBN_13: book.ISBN_13, status: 'borrowed', borrowedBy: 1 }
      ]);
    }

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