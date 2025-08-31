// AdminPanel.tsx
import { useState } from "react";
import BooksManager from "../components/BooksManager";
import CopiesManager from "../components/CopiesManager";
import BorrowsManager from "../components/BorrowsManager";
import UsersManager from "../components/UsersManager";
import { useAuth } from '../context/AuthContext'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"books" | "copies" | "borrows" | "users">("books");
  const [selectedISBN, setSelectedISBN] = useState<string | null>(null);
  const { logout } = useAuth()

  return (
   <div className="p-6 max-w-6xl mx-auto">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">📚 Panel Administratora</h1>
    <button
      onClick={logout}
      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
    >
      Logout
    </button>
  </div>

  {/* Zakładki */}
  <div className="flex space-x-4 mb-6">
    <button
      onClick={() => setActiveTab("books")}
      className={`px-4 py-2 rounded-lg ${activeTab === "books" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    >
      Książki
    </button>

    {selectedISBN && (
      <button
        onClick={() => setActiveTab("copies")}
        className={`px-4 py-2 rounded-lg ${activeTab === "copies" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        Egzemplarze
      </button>
    )}

    <button
      onClick={() => setActiveTab("borrows")}
      className={`px-4 py-2 rounded-lg ${activeTab === "borrows" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    >
      Rezerwacje
    </button>

    <button
      onClick={() => setActiveTab("users")}
      className={`px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    >
      Użytkownicy
    </button>
  </div>

  {/* Zawartość */}
  <div className="bg-white shadow-lg rounded-lg p-4">
    {activeTab === "books" && (
      <BooksManager onManageCopies={(isbn) => {
        setSelectedISBN(isbn);
        setActiveTab("copies");
      }} />
    )}
    {activeTab === "copies" && selectedISBN && (
      <CopiesManager ISBN_13={selectedISBN} />
    )}
    {activeTab === "borrows" && (
      <BorrowsManager />
    )}
    {activeTab === "users" && (
      <UsersManager />
    )}
  </div>
</div>

  );
}
