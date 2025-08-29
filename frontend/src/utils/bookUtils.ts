// Utility functions
export const getBookAvailability = (book: any) => {
  const availableCopies = book.copies?.filter((copy: any) => copy.status === 'available').length || 0;
  const totalCopies = book.copies?.length || 0;
  return { availableCopies, totalCopies };
};

export const calculateAverageRating = (reviews: any[]) => {
  return reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
};