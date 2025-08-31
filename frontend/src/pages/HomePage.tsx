import { useState, useEffect } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import api from "../utils/api"
import BookCard from "../components/BookCard"

export default function HomePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data);
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to fetch books");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";

    return title.includes(query) || author.includes(query);
  });

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-800 text-lg">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">📚 Kolekcja Biblioteczna</h1>
          <p className="text-gray-600 mb-6">
            Odkryj i wypożycz książki z naszej kolekcji {books.length} pozycji
            {searchQuery && ` (${filteredBooks.length} pasujących do wyszukiwania)`}
          </p>

          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Wyszukaj po tytule lub autorze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {filteredBooks.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nie znaleziono książek</h3>
            <p className="text-gray-600">Spróbuj wyszukać używając innych słów kluczowych</p>
          </div>
        ) : (
          <div className="grid gap-12 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
            {filteredBooks.map((book: any, index: number) => (
              <BookCard
                key={book.ISBN_13}
                book={book}
                index={index}
                onBookBorrowed={fetchBooks}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
