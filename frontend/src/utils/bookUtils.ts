// Mock data for book descriptions and reviews
export const mockBookData: Record<string, { description: string; reviews: any[] }> = {
  "9780134685991": {
    description: "Effective Java, Third Edition, brings together seventy-eight indispensable programmer's rules of thumb: working, best-practice solutions for the programming challenges you encounter every day. This highly anticipated new edition has been thoroughly updated to cover Java SE 9, 10, and 11, and features four brand new items.",
    reviews: [
      { id: 1, user: "Alex Chen", rating: 5, comment: "Essential reading for any Java developer. The examples are crystal clear and the advice is invaluable.", date: "2024-03-15" },
      { id: 2, user: "Sarah Johnson", rating: 5, comment: "Bloch's insights into Java best practices are unmatched. Every chapter taught me something new.", date: "2024-02-28" },
      { id: 3, user: "Mike Rodriguez", rating: 4, comment: "Great book but can be dense at times. Worth the effort though!", date: "2024-01-20" }
    ]
  },
  "9781617294563": {
    description: "Spring in Action, 5th Edition is the fully updated revision of Manning's bestselling Spring in Action. This new edition includes all Spring 5.0 updates, along with new examples on reactive programming, Spring WebFlux, and microservices. You'll also find the latest Spring best practices.",
    reviews: [
      { id: 1, user: "Jennifer Lee", rating: 5, comment: "Comprehensive guide to Spring Framework. Perfect for both beginners and experienced developers.", date: "2024-03-10" },
      { id: 2, user: "David Park", rating: 4, comment: "Well-structured book with practical examples. The Spring Boot coverage is excellent.", date: "2024-02-15" }
    ]
  },
  "9780596007126": {
    description: "According to the Hacker Jargon File, there are five kinds of hackers, classified by what they hack: hardware, software, wetware (human), firmware, and data. This book is about software hackers, and the communities they form.",
    reviews: [
      { id: 1, user: "Emma Wilson", rating: 4, comment: "Fascinating look at the philosophy behind open source development. A bit dated but still relevant.", date: "2024-01-25" },
      { id: 2, user: "Robert Kim", rating: 5, comment: "Classic book that every programmer should read. Raymond's insights are timeless.", date: "2023-12-10" }
    ]
  },
  "9780201633610": {
    description: "A catalog of solutions to commonly occurring design problems, presenting 23 patterns that allow designers to create flexible and reusable object-oriented software.",
    reviews: [
      { id: 1, user: "Lisa Chang", rating: 5, comment: "The bible of design patterns. Every software architect should read this.", date: "2024-02-20" },
      { id: 2, user: "Tom Wilson", rating: 4, comment: "Classic book, though some patterns are less relevant now. Still worth reading.", date: "2024-01-15" }
    ]
  },
  "9780132350884": {
    description: "Clean Code is divided into three parts. The first describes the principles, patterns, and practices of writing clean code. The second part consists of several case studies of increasing complexity.",
    reviews: [
      { id: 1, user: "Maria Garcia", rating: 5, comment: "Changed the way I write code. Uncle Bob's advice is gold.", date: "2024-03-05" },
      { id: 2, user: "James Taylor", rating: 5, comment: "Should be mandatory reading for all developers. Clear, practical advice.", date: "2024-02-10" }
    ]
  }
};

// Utility functions
export const getBookAvailability = (book: any) => {
  const availableCopies = book.copies?.filter((copy: any) => copy.status === 'available').length || 0;
  const totalCopies = book.copies?.length || 0;
  return { availableCopies, totalCopies };
};

export const getBookMockData = (isbn: string) => {
  return mockBookData[isbn] || { 
    description: "A fascinating exploration of programming concepts and methodologies that will enhance your understanding and skills.", 
    reviews: [
      { id: 1, user: "Anonymous Reader", rating: 4, comment: "Great book with valuable insights!", date: "2024-01-01" }
    ]
  };
};

export const calculateAverageRating = (reviews: any[]) => {
  return reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
};