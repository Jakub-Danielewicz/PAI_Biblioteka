import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import BookCard from "../components/BookCard";
import api from "../utils/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data || []);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to fetch favorites");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <HeartIcon className="w-16 h-16 text-red-300 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-800 text-lg">Ładowanie ulubionych...</p>
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
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">❤️ Moje Ulubione</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HeartIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Moje Ulubione</h1>
          </div>
          <p className="text-gray-600">
            Twoja osobista kolekcja {favorites.length} ulubionych książek
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Brak ulubionych książek</h3>
            <p className="text-gray-500 mb-6">
              Zacznij dodawać książki do ulubionych klikając ikonę serca na dowolnej karcie książki
            </p>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
            >
              Przeglądaj książki
            </a>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
            {favorites.map((favorite: any, index: number) => (
              <BookCard 
                key={favorite.id} 
                book={favorite.book} 
                index={index}
                onBookBorrowed={fetchFavorites} // Refresh favorites if needed
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}