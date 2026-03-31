import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import SeatGrid from "./components/SeatGrid";
import MyBookings from "./components/MyBookings";

export default function App() {
  // Check if user is already logged in from localStorage
  const savedUser = localStorage.getItem("user");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null)

  // Toggle between login and register forms
  const [authPage, setAuthPage] = useState("login");

  // Active tab inside the main app
  const [tab, setTab] = useState("book");

  // Called when login succeeds
  const handleLogin = (userData) => setUser(userData);

  // Logout: clear storage and reset state
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthPage("login");
  };

  // ── Not logged in ──────────────────────────────────────────
  if (!user) {
    return authPage === "login" ? (
      <Login
        onLogin={handleLogin}
        onSwitch={() => setAuthPage("register")}
      />
    ) : (
      <Register onSwitch={() => setAuthPage("login")} />
    );
  }

  // ── Logged in ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 right-1/3 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-blue-500 flex items-center justify-center shadow-md shadow-pink-100">
              <span className="text-white text-sm">🪑</span>
            </div>
            <span className="font-display font-bold text-gray-800 text-lg tracking-tight">
              SeatEase
            </span>
          </div>

          {/* Nav tabs */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("book")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold font-body transition-all duration-200 ${
                tab === "book"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Book Seats
            </button>
            <button
              onClick={() => setTab("bookings")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold font-body transition-all duration-200 ${
                tab === "bookings"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              My Bookings
            </button>
            
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-indigo-400 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-body">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-body font-medium">
                {user.name}
              </span>
              </div>
              <button
              onClick={handleLogout}
              className="text-xs font-semibold font-body px-3.5 py-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "book" ? <SeatGrid /> : <MyBookings />}
      </main>
    </div>
  );
}