import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { getBookAvailability } from "../utils/bookUtils";

interface BookCardProps {
  book: any;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { availableCopies, totalCopies } = getBookAvailability(book);
  
  return (
    <Link to={`/book/${book.ISBN_13}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border-l-8 border-blue-500 transition transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      >
        <div className="flex items-start gap-4 mb-4">
          <BookOpenIcon className="w-10 h-10 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
            <p className="text-gray-500 text-sm">{book.publisher} • {book.year}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {availableCopies > 0 ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-500" />
            )}
            <span className="text-gray-700 text-sm font-medium">
              {availableCopies}/{totalCopies} available
            </span>
          </div>
          
          <button 
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all hover:scale-105 ${
              availableCopies > 0 
                ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={availableCopies === 0}
            onClick={(e) => e.preventDefault()} // Prevent navigation when clicking button
          >
            {availableCopies > 0 ? 'Borrow Book' : 'Unavailable'}
          </button>
        </div>

        <p className="text-gray-500 text-xs">ISBN: {book.ISBN_13}</p>
      </motion.div>
    </Link>
  );
}