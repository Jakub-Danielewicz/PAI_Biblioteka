import { useState, useEffect } from "react";

const availableAvatars: string[] = ["👓", "🖋️", "📖", "📚", "📜", "📘"];

interface User {
  email: string;
  createdAt: string;
  booksRented: number;
  reviewsCount: number;
  nickname: string;
  avatar: string;
}

const defaultUser: User = {
  email: "john.doe@example.com",
  createdAt: "2024-02-15",
  booksRented: 12,
  reviewsCount: 5,
  nickname: "",
  avatar: "📖",
};

export default function UserProfile() {
  const [nickname, setNickname] = useState<string>("");
  const [avatar, setAvatar] = useState<string>(defaultUser.avatar);
  const [editingNick, setEditingNick] = useState<boolean>(false);
  const [tempNick, setTempNick] = useState<string>("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedAvatar = localStorage.getItem("avatar");
    if (storedNickname) setNickname(storedNickname);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  const handleSaveNick = () => {
    if (tempNick.trim() === "") return;
    setNickname(tempNick);
    localStorage.setItem("nickname", tempNick);
    setEditingNick(false);
    setTempNick("");
  };

  const handleSelectAvatar = (a: string) => {
    setAvatar(a);
    localStorage.setItem("avatar", a);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex flex-col p-10 space-y-8 text-white">
        
        {/* Header: Avatar next to Nickname */}
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-7xl animate-bounce">{avatar}</div>
          <h1 className="text-3xl font-extrabold drop-shadow-lg">{nickname || "User Profile"}</h1>
        </div>

        {/* Info fields */}
        <div className="flex flex-col space-y-4">
          {[
            { label: "Email", value: defaultUser.email },
            { label: "Account Created", value: defaultUser.createdAt },
            { label: "Books Rented", value: defaultUser.booksRented },
            { label: "Reviews Written", value: defaultUser.reviewsCount },
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

        {/* Nickname */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-base">Nickname:</p>
            <p className="font-semibold text-lg">{nickname || "Not set"}</p>
          </div>

          {editingNick && (
            <div className="flex flex-col md:flex-row md:space-x-3 mt-2 space-y-2 md:space-y-0">
              <input
                type="text"
                className="flex-1 rounded-xl px-4 py-2 text-black text-base bg-white/20 backdrop-blur-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner transition"
                value={tempNick}
                onChange={(e) => setTempNick(e.target.value)}
                placeholder="Enter new nickname"
              />
              <button
                onClick={handleSaveNick}
                className="px-4 py-2 rounded-xl font-semibold text-white text-base bg-gradient-to-br from-purple-600 via-purple-400 to-purple-600 hover:brightness-110 transition shadow-lg"
              >
                Save
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setEditingNick(true);
              setTempNick(nickname);
            }}
            className="mt-2 px-4 py-2 rounded-xl font-semibold text-white text-base bg-gradient-to-br from-purple-600 via-purple-400 to-purple-600 hover:brightness-110 transition shadow-lg"
          >
            {nickname ? "Change Nickname" : "Set Nickname"}
          </button>
        </div>

        {/* Avatar selection */}
        <div className="flex flex-col space-y-3">
          <p className="font-medium mb-2 text-center text-base">Choose Avatar</p>
          <div className="flex flex-row justify-center flex-wrap gap-4">
            {availableAvatars.map((a) => (
              <button
                key={a}
                onClick={() => handleSelectAvatar(a)}
                className={`text-5xl p-2 rounded-lg transition transform hover:scale-125 hover:rotate-3 bg-transparent border-none focus:outline-none ${
                  avatar === a
                    ? "ring-4 ring-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                    : ""
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
