import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const data = await loginUser(form.email, form.password);

    if (data.token) {
      // Save token and user info, then notify parent
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } else {
      setMsg(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-10 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-200 mb-4">
              <span className="text-white text-2xl">🪑</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-800 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-400 mt-1 text-sm font-body">
              Sign in to manage your bookings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-700 text-sm font-body bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-body">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-700 text-sm font-body bg-gray-50/50"
              />
            </div>

            {/* Error message */}
            {msg && (
              <p className="text-sm text-center py-2.5 px-4 rounded-xl bg-red-50 text-red-500 font-body">
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-60 font-body mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-body">
            Don't have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-blue-500 font-semibold hover:text-blue-600 transition">

              Register
              
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}