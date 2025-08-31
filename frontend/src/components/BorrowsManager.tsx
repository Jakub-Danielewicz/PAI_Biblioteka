import { useEffect, useState } from "react";
import api from "../utils/api";

interface Borrow {
  id: number;
  borrowedAt: string;
  returnedAt: string | null;
  copy: {
    id: number;
    ISBN_13: string;
    status: string;
    book: {
      ISBN_13: string;
      title: string;
      author: string;
      publisher: string;
      year: number;
    } | null;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function BorrowsManager() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/borrows")
      .then(res => {
          setBorrows(res.data);
      })
      .catch(() => setBorrows([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie rezerwacji...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📚 Wszystkie rezerwacje</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Użytkownik</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Tytuł książki</th>
            <th className="border p-2">ISBN</th>
            <th className="border p-2">Status egzemplarza</th>
            <th className="border p-2">Data wypożyczenia</th>
            <th className="border p-2">Data zwrotu</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{b.user.name}</td>
              <td className="border p-2">{b.user.email}</td>
              <td className="border p-2">{b.copy.book?.title || "Brak danych"}</td>
              <td className="border p-2">{b.copy.ISBN_13}</td>
              <td className="border p-2">{b.copy.status}</td>
              <td className="border p-2">{new Date(b.borrowedAt).toLocaleDateString()}</td>
              <td className="border p-2">{b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : "Nie zwrócono"}</td>
            </tr>
          ))}
          {borrows.length === 0 && (
            <tr><td colSpan={7} className="text-center p-4">Brak rezerwacji</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
