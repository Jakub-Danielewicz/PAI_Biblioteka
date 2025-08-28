import { useParams } from "react-router";
import Navbar from "../components/Navbar";
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
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-800 text-lg">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">📚 Book Not Found</h1>
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-800">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Book Card - same as homepage but centered */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <BookCard book={book} />
            </div>
          </div>
          
          {/* Book Details */}
          <BookDetails book={book} />
        </div>
      </main>
    </div>
  );
}
