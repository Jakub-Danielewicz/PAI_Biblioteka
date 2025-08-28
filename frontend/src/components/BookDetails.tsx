import { StarIcon, UserIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { getBookAvailability, getBookMockData } from "../utils/bookUtils";

interface BookDetailsProps {
  book: any;
}

export default function BookDetails({ book }: BookDetailsProps) {
  const { availableCopies, totalCopies } = getBookAvailability(book);
  const mockData = getBookMockData(book.ISBN_13);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Description and Reviews */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:col-span-2"
      >
        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Description</h2>
          <p className="text-gray-700 leading-relaxed">{mockData.description}</p>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Reviews ({mockData.reviews.length})</h2>
          <div className="space-y-4">
            {mockData.reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <UserIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{review.user}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-6"
      >
        {/* Copies Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Available Copies</h3>
          {book.copies?.map((copy: any) => (
            <div key={copy.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Copy #{copy.id}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                copy.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {copy.status}
              </span>
            </div>
          ))}
        </div>

        {/* Book Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Book Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-semibold">{mockData.reviews.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Publication Year</span>
              <span className="font-semibold">{book.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Copies</span>
              <span className="font-semibold">{totalCopies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Now</span>
              <span className="font-semibold">{availableCopies}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}