import { BookOpenIcon, CheckCircleIcon, XCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getBookAvailability } from "../utils/bookUtils";
import BorrowDateModal from "./BorrowDateModal";
import api from "../utils/api";

interface BookCardProps {
  book: any;
  index?: number;
  onBookBorrowed?: () => void;
}

export default function BookCard({ book, index = 0, onBookBorrowed }: BookCardProps) {
  const { availableCopies, totalCopies } = getBookAvailability(book);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const checkIfAlreadyBorrowed = async () => {
      try {
        const response = await api.get('/borrows');
        const userBorrows = response.data;
        const hasActiveBorrow = userBorrows.some((borrow: any) => 
          borrow.copy.ISBN_13 === book.ISBN_13 && borrow.returnedAt === null
        );
        setAlreadyBorrowed(hasActiveBorrow);
      } catch (error) {
        console.error('Failed to check borrow status:', error);
      }
    };

    checkIfAlreadyBorrowed();
  }, [book.ISBN_13]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await api.get(`/api/favorites/check/${book.ISBN_13}`);
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [book.ISBN_13]);

  const handleBorrowClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to book page
    setShowBorrowModal(true);
  };

  const handleBorrowConfirm = async (returnDate: string) => {
    setBorrowing(true);
    try {
      await api.post('/borrow', {
        ISBN_13: book.ISBN_13,
        returnDate: returnDate
      });
      
      setShowBorrowModal(false);
      setAlreadyBorrowed(true); // Update local state
      if (onBookBorrowed) {
        onBookBorrowed(); // Refresh the books list
      }
    } catch (error: any) {
      console.error('Failed to borrow book:', error);
      alert(error.response?.data?.error || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to book page
    e.stopPropagation(); // Prevent event bubbling
    
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${book.ISBN_13}`);
        setIsFavorite(false);
      } else {
        await api.post('/api/favorites', { bookId: book.ISBN_13 });
        setIsFavorite(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      alert(error.response?.data?.error || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  return (
    <>
      <Link to={`/book/${book.ISBN_13}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border-l-8 border-blue-500 transition transform hover:scale-105 hover:shadow-2xl cursor-pointer"
        >
          <div className="flex items-start gap-4 mb-4 relative">
            <BookOpenIcon className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
              <p className="text-gray-500 text-sm">{book.publisher} • {book.year}</p>
            </div>
            
            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            >
              <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {availableCopies > 0 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
              <span className="text-gray-700 text-sm font-medium">
                {availableCopies}/{totalCopies} dostępnych
              </span>
            </div>
            
            <button 
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all hover:scale-105 ${
                alreadyBorrowed
                  ? 'bg-yellow-500 text-white cursor-not-allowed'
                  : availableCopies > 0 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={availableCopies === 0 || borrowing || alreadyBorrowed}
              onClick={handleBorrowClick}
            >
              {borrowing 
                ? 'Wypożyczanie...' 
                : alreadyBorrowed 
                  ? 'Już wypożyczona' 
                  : availableCopies > 0 
                    ? 'Wypożycz książkę' 
                    : 'Niedostępna'}
            </button>
          </div>

          <p className="text-gray-500 text-xs">ISBN: {book.ISBN_13}</p>
        </motion.div>
      </Link>
      
      <BorrowDateModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onConfirm={handleBorrowConfirm}
        bookTitle={book.title}
        loading={borrowing}
      />
    </>
  );
}