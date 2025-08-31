import { useState, useEffect } from "react";
import api from "../utils/api"; 

interface Book {
  ISBN_13: string;
  title: string;
  author: string;
  publisher?: string;
  year?: number;
}

interface BooksManagerProps {
  onManageCopies: (isbn: string) => void;
}

function isValidISBN13(isbn: string) {
  const digitsOnly = isbn.replace(/[^0-9]/g, "");
  if (digitsOnly.length !== 13) return false;

  const digits = digitsOnly.split("").map(Number);
  const sum = digits
    .slice(0, 12)
    .reduce((acc, val, idx) => acc + val * (idx % 2 === 0 ? 1 : 3), 0);
  const check = (10 - (sum % 10)) % 10;
  return check === digits[12];
}

export default function BooksManager({ onManageCopies }: BooksManagerProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({
    ISBN_13: "",
    title: "",
    author: "",
    publisher: "",
    year: undefined,
  });
  const [error, setError] = useState<string>("");

useEffect(() => {
  api.get("/books")
    .then((res) => {
      if (res.data && Array.isArray(res.data.data)) {
        setBooks(res.data.data);  
      } else {
        setBooks([]);
      }
    })
    .catch(() => setBooks([]));
}, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBook = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isValidISBN13(form.ISBN_13)) {
    setError("Nieprawidłowy ISBN-13!");
    return;
  }

  setError("");

  try {
    const res = await api.post("/books", form);
    setBooks([...books, res.data]);
    setForm({ ISBN_13: "", title: "", author: "", publisher: "", year: undefined });
  } catch (err: any) {
    setError(err.response?.data?.message || "Błąd dodawania książki");
  }
};


  const handleDeleteBook = async (isbn: string) => {
    try {
      await api.delete(`/books/${isbn}`);
      setBooks(books.filter((b) => b.ISBN_13 !== isbn));
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd usuwania książki");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📖 Zarządzanie książkami</h2>

      <form onSubmit={handleAddBook} className="grid grid-cols-2 gap-2 mb-6">
        <input name="ISBN_13" placeholder="ISBN-13" value={form.ISBN_13} onChange={handleChange} required className="border p-2" />
        <input name="title" placeholder="Tytuł" value={form.title} onChange={handleChange} required className="border p-2" />
        <input name="author" placeholder="Autor" value={form.author} onChange={handleChange} required className="border p-2" />
        <input name="publisher" placeholder="Wydawca" value={form.publisher} onChange={handleChange} className="border p-2" />
        <input name="year" type="number" placeholder="Rok wydania" value={form.year || ""} onChange={handleChange} min="1000" max={new Date().getFullYear()} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Dodaj książkę</button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ISBN</th>
            <th className="border p-2">Tytuł</th>
            <th className="border p-2">Autor</th>
            <th className="border p-2">Wydawca</th>
            <th className="border p-2">Rok</th>
            <th className="border p-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.ISBN_13}>
              <td className="border p-2">{book.ISBN_13}</td>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.publisher}</td>
              <td className="border p-2">{book.year}</td>
              <td className="border p-2 space-x-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => onManageCopies(book.ISBN_13)}>Zarządzaj egzemplarzami</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteBook(book.ISBN_13)}>Usuń</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr><td colSpan={6} className="text-center p-4">Brak książek</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
