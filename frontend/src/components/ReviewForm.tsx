import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

interface ReviewFormProps {
  bookId: string;
  onReviewAdded: (review: any) => void;
  onCancel: () => void;
}

export default function ReviewForm({ bookId, onReviewAdded, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/api/reviews/${bookId}`, {
        rating,
        comment: comment.trim()
      });

      onReviewAdded(response.data);
      setRating(0);
      setComment('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">✍️ Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                {star <= rating ? (
                  <StarIcon className="w-6 h-6 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-6 h-6 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Share your thoughts about this book..."
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}