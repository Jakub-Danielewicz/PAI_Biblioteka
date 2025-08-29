import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user, login } = useAuth(); // Get user from context
  const [loading, setLoading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return <p className="text-white">User not logged in</p>;

  const handleSaveName = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: tempName }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Update context with new name
        login(localStorage.getItem("token")!, { ...user, name: data.name });
        setEditingName(false);
        setMessage("Nickname updated successfully!");
      } else {
        setMessage(data.message || "Error updating nickname");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Error changing password");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex flex-col p-10 space-y-8 text-white">
        
        {/* Header */}
        <div className="flex flex-row items-center justify-center space-x-4">
          <h1 className="text-3xl font-extrabold drop-shadow-lg">{user.name}</h1>
        </div>

        {/* Info */}
        <div className="flex flex-col space-y-4">
          {[
            { label: "Email", value: user.email },
          ].map((info) => (
            <div
              key={info.label}
              className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition"
            >
              <p className="text-base opacity-90">{info.label}</p>
              <p className="font-semibold text-lg">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Change Name */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-base">Nickname:</p>
            <p className="font-semibold text-lg">{user.name}</p>
          </div>

          {editingName && (
            <div className="flex flex-col md:flex-row md:space-x-3 mt-2 space-y-2 md:space-y-0">
              <input
                type="text"
                className="flex-1 rounded-xl px-4 py-2 text-black"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter new nickname"
              />
              <button
                onClick={handleSaveName}
                disabled={loading}
                className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-purple-600 via-purple-400 to-purple-600"
              >
                Save
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setEditingName(true);
              setTempName(user.name);
            }}
            className="mt-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-purple-600 via-purple-400 to-purple-600"
          >
            Change Nickname
          </button>
        </div>

        {/* Password Change */}
        <div className="flex flex-col space-y-3">
          <p className="font-medium text-lg">Change Password</p>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current Password"
            className="rounded-xl px-4 py-2 text-black"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="rounded-xl px-4 py-2 text-black"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="rounded-xl px-4 py-2 text-black"
          />
          <button
            onClick={handlePasswordChange}
            disabled={loading}
            className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-purple-600 via-purple-400 to-purple-600"
          >
            Update Password
          </button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}
