import { StarIcon, UserIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getBookAvailability, calculateAverageRating } from "../utils/bookUtils";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";
import api from "../utils/api";

interface BookDetailsProps {
  book: any;
}

export default function BookDetails({ book }: BookDetailsProps) {
  const { user } = useAuth();
  const { availableCopies, totalCopies } = getBookAvailability(book);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  
  const averageRating = calculateAverageRating(reviews);
  
  // Filter reviews by star rating
  const filteredReviews = starFilter 
    ? reviews.filter(review => review.rating === starFilter)
    : reviews;
  
  // Check if current user has already reviewed this book
  const userReview = user ? reviews.find(review => review.user?.id === user.id) : null;
  const canReview = user && !userReview;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/${book.ISBN_13}`);
        setReviews(response.data || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (book.ISBN_13) {
      fetchReviews();
    }
  }, [book.ISBN_13]);

  const handleReviewAdded = (newReview: any) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error: any) {
      console.error('Failed to delete review:', error);
      alert(error.response?.data?.error || 'Failed to delete review');
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Opis</h2>
          <p className="text-gray-700 leading-relaxed">
            {book.description || "Brak opisu dla tej książki."}
          </p>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">⭐ Recenzje ({reviews.length})</h2>
            <div className="flex items-center gap-3">
              {canReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <PlusIcon className="w-4 h-4" />
                  Napisz recenzję
                </button>
              )}
              {userReview && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  Już recenzowałeś tę książkę
                </div>
              )}
            </div>
          </div>

          {/* Star Filter */}
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-2">Filtruj według oceny:</span>
              <button
                onClick={() => setStarFilter(null)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  starFilter === null
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Wszystkie
              </button>
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setStarFilter(stars)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all ${
                    starFilter === stars
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {stars}
                  <StarIcon className="w-3 h-3" />
                </button>
              ))}
              {starFilter && (
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredReviews.length} recenzji)
                </span>
              )}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                bookId={book.ISBN_13}
                onReviewAdded={handleReviewAdded}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Ładowanie recenzji...</p>
            </div>
          ) : reviews.length > 0 ? (
            filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review: any, index: number) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {review.user?.name || 'Anonymous'}
                          </span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {user && review.user?.id === user.id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete your review"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Brak recenzji o wybranej ocenie.</p>
                <button
                  onClick={() => setStarFilter(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 underline"
                >
                  Pokaż wszystkie recenzje
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Brak dostępnych recenzji dla tej książki.</p>
              {canReview && (
                <p className="text-gray-400 text-sm mt-2">Bądź pierwszy, który ją zrecenzuje!</p>
              )}
            </div>
          )}
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
          <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Dostępne Egzemplarze</h3>
          {book.copies?.map((copy: any) => (
            <div key={copy.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Egzemplarz #{copy.id}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                copy.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {copy.status === 'available' ? 'dostępny' : 'wypożyczony'}
              </span>
            </div>
          ))}
        </div>

        {/* Book Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statystyki Książki</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Łączna liczba recenzji</span>
              <span className="font-semibold">{reviews.length}</span>
            </div>
            {reviews.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Średnia ocena</span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Rok wydania</span>
              <span className="font-semibold">{book.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Łącznie egzemplarzy</span>
              <span className="font-semibold">{totalCopies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dostępne teraz</span>
              <span className="font-semibold">{availableCopies}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}