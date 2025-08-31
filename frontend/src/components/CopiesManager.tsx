import { useState, useEffect } from "react";
import api from "../utils/api";

interface Copy {
  id: number;
  ISBN_13: string;
  status: "available" | "borrowed";
  borrowedBy: string | null;
}

interface CopiesManagerProps {
  ISBN_13: string;
}

export default function CopiesManager({ ISBN_13 }: CopiesManagerProps) {
  const [copies, setCopies] = useState<Copy[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCopies();
  }, [ISBN_13]);

  const fetchCopies = async () => {
    try {
      const res = await api.get(`/books/${ISBN_13}/copies`);
      // backend zwraca tablicę bez data
      setCopies(res.data || []);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd pobierania egzemplarzy");
    }
  };

  const handleAddCopy = async () => {
    try { 
      const res = await api.post(`/books/${ISBN_13}/copies`, { status: "available" });
      setCopies(prev => [...prev, res.data]);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd dodawania egzemplarza");
    }
  };

  const handleDeleteCopy = async (id: number) => {
    try {
      await api.delete(`/books/${ISBN_13}/copies/${id}`);
      setCopies(prev => prev.filter(c => c.id !== id));
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd usuwania egzemplarza");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🗂️ Egzemplarze książki {ISBN_13}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button 
        onClick={handleAddCopy} 
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Dodaj nowy egzemplarz
      </button>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {copies.map(copy => (
            <tr key={copy.id}>
              <td className="border p-2">{copy.id}</td>
              <td className="border p-2">{copy.status}</td>
              <td className="border p-2 space-x-2">
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteCopy(copy.id)}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
          {copies.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4">Brak egzemplarzy</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
