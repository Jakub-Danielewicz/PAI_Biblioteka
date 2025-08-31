import { useState, useEffect } from "react";
import api from "../utils/api";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user");
      setUsers(response.data || []);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Błąd pobierania użytkowników");
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    if (newUser.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    try {
      const response = await api.post("/auth/register", newUser);
      setUsers([...users, response.data.user]);
      setNewUser({ name: "", email: "", password: "" });
      setShowAddForm(false);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd dodawania użytkownika");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      return;
    }

    try {
      await api.delete(`/user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Błąd usuwania użytkownika");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Ładowanie użytkowników...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">👥 Zarządzanie użytkownikami</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          {showAddForm ? "Anuluj" : "Dodaj użytkownika"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formularz dodawania użytkownika */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Dodaj nowego użytkownika</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Imię i nazwisko"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Hasło (min. 6 znaków)"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
              minLength={6}
            />
            <div className="md:col-span-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Dodaj użytkownika
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela użytkowników */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">Imię i nazwisko</th>
              <th className="border border-gray-300 p-3 text-left">Email</th>
              <th className="border border-gray-300 p-3 text-left">Data rejestracji</th>
              <th className="border border-gray-300 p-3 text-left">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{user.id}</td>
                <td className="border border-gray-300 p-3">{user.name}</td>
                <td className="border border-gray-300 p-3">{user.email}</td>
                <td className="border border-gray-300 p-3">
                  {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                </td>
                <td className="border border-gray-300 p-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      disabled={user.email === "admin@admin.pl"}
                    >
                      {user.email === "admin@admin.pl" ? "Admin" : "Usuń"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  Brak użytkowników w systemie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Łącznie użytkowników: <strong>{users.length}</strong></p>
      </div>
    </div>
  );
}