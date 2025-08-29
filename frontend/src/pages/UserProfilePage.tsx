import { useState } from "react";
import api from "../utils/api";
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
      const response = await api.put("/api/user", { name: tempName });

      login(localStorage.getItem("token")!, response.data.user);
      setEditingName(false);
      setMessage("Nickname updated successfully!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error updating nickname";
      setMessage(errorMessage);
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
      await api.put("/api/user", {
        currentPassword: oldPassword,
        newPassword: newPassword
      });

      setMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error changing password";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 mx-auto">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-purple-200 text-lg">{user.email}</p>
        </div>

        {/* Content Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Profile Info Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-purple-200 text-sm font-medium mb-2">Display Name</label>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-medium">{user.name}</span>
                  {!editingName ? (
                    <button
                      onClick={() => {
                        setEditingName(true);
                        setTempName(user.name);
                      }}
                      className="text-purple-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>

              {editingName && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                  <label className="block text-purple-200 text-sm font-medium">New Display Name</label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter new display name"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-purple-200 text-sm font-medium mb-2">Email Address</label>
                <span className="text-white text-lg">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-purple-200 text-sm font-medium mb-3">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-purple-200 text-sm font-medium mb-3">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-purple-200 text-sm font-medium mb-3">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handlePasswordChange}
                disabled={loading || !oldPassword || !newPassword || !confirmPassword}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mt-8 p-4 rounded-lg text-center font-medium ${
            message.includes('successfully') 
              ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
              : 'bg-red-500/20 text-red-200 border border-red-400/30'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
