import { useState, type ChangeEvent, type FormEvent } from "react";

interface Book {
  ISBN_13: string;
  title: string;
  author: string;
  publisher?: string;
  year?: number;
  copies: number;
}

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({
    ISBN_13: "",
    title: "",
    author: "",
    publisher: "",
    year: undefined,
    copies: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "year" || name === "copies" ? Number(value) : value,
    }));
  };

  const isValidISBN13 = (isbn: string) => {
    const cleanIsbn = isbn.replace(/[-\s]/g, "");
    if (!/^\d{13}$/.test(cleanIsbn)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanIsbn[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleanIsbn[12]);
  };

  const handleAddBook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidISBN13(form.ISBN_13)) {
      alert("Invalid ISBN-13 number");
      return;
    }
    setBooks((prev) => [...prev, form]);
    setForm({ ISBN_13: "", title: "", author: "", publisher: "", year: undefined, copies: 1 });
  };

  const handleRemoveBook = (isbn: string) => {
    setBooks((prev) => prev.filter((b) => b.ISBN_13 !== isbn));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Panel</h1>

      <form
        onSubmit={handleAddBook}
        className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="ISBN_13"
          placeholder="ISBN-13"
          value={form.ISBN_13}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <input
          name="publisher"
          placeholder="Publisher"
          value={form.publisher}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          value={form.year || ""}
          onChange={handleChange}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <input
          name="copies"
          type="number"
          placeholder="Copies"
          value={form.copies}
          onChange={handleChange}
          min={1}
          required
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 w-full"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Add Book
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Books in Library</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ISBN</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">Publisher</th>
              <th className="py-3 px-4 text-left">Year</th>
              <th className="py-3 px-4 text-left">Copies</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No books added yet
                </td>
              </tr>
            )}
            {books.map((book, idx) => (
              <tr
                key={book.ISBN_13}
                className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}
              >
                <td className="py-2 px-4">{book.ISBN_13}</td>
                <td className="py-2 px-4">{book.title}</td>
                <td className="py-2 px-4">{book.author}</td>
                <td className="py-2 px-4">{book.publisher}</td>
                <td className="py-2 px-4">{book.year}</td>
                <td className="py-2 px-4">{book.copies}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
                    onClick={() => handleRemoveBook(book.ISBN_13)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
