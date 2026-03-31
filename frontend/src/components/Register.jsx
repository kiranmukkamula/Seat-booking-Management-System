import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form field on change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const data = await registerUser(form.name, form.email, form.password);
    setMsg(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Background blobs for visual interest */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 p-8">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200 mb-4">
              <span className="text-white text-2xl">🪑</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 mt-1 text-sm font-body">
              Join SeatEase to book your spot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-body">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition text-gray-700 text-sm font-body bg-gray-50/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-body">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition text-gray-700 text-sm font-body bg-gray-50/50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-body">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition text-gray-700 text-sm font-body bg-gray-50/50"
              />
            </div>

            {/* Message feedback */}
            {msg && (
              <p
                className={`text-sm text-center py-2.5 px-4 rounded-xl font-body ${
                  msg.toLowerCase().includes("success")
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {msg}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-600 transition-all duration-200 disabled:opacity-60 font-body mt-2"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center text-sm text-gray-400 mt-6 font-body">
            Already have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-pink-500 font-semibold hover:text-pink-600 transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}