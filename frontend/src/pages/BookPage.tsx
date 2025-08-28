import { useParams } from "react-router";
import BookCard from "../components/BookCard";
import BookDetails from "../components/BookDetails";
import { useEffect, useState } from "react";

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/books/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch book');
          }
          return response.json();
        })
        .then(data => {
          setBook(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-800 text-lg">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">📚 Book Not Found</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-800">Book not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <BookCard book={book} />
        </div>
      </div>
      
      <BookDetails book={book} />
    </div>
  );
}
