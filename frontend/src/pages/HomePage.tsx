import axios from "axios"
import { useState, useEffect } from "react"
import BookCard from "../components/BookCard"

export default function HomePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3001/books");
        setBooks(response.data.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError("Failed to fetch books");
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-800 text-lg">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">📚 Welcome to BookHaven</h1>
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">📚 Library Collection</h1>
        <p className="text-gray-600">Discover and borrow from our collection of {books.length} books</p>
      </div>

      <div className="grid gap-12 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        {books.map((book: any, index: number) => (
          <BookCard key={book.ISBN_13} book={book} index={index} />
        ))}
      </div>
    </>
  )
}
