import { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getMyBookings();
    // If it's an array of bookings, set them; otherwise it's an error message
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    const data = await cancelBooking(id);
    setMsg(data.message);
    setCancellingId(null);
    fetchBookings(); // refresh list
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800">
          My Bookings
        </h2>
        <p className="text-gray-400 text-sm mt-1 font-body">
          All your upcoming seat reservations
        </p>
      </div>

      {/* Feedback */}
      {msg && (
        <div
          className={`mb-4 text-sm py-3 px-5 rounded-xl font-body ${
            msg.toLowerCase().includes("cancel")
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-red-50 text-red-500 border border-red-100"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 bg-white/70 rounded-3xl border border-gray-100 shadow-lg shadow-blue-50">
          <div className="text-5xl mb-4">🪑</div>
          <p className="text-gray-500 font-body text-lg font-medium">
            No bookings yet
          </p>
          <p className="text-gray-400 text-sm mt-1 font-body">
            Head over to Book Seats to reserve your spot
          </p>
        </div>
      ) : (
        /* Bookings list */
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm shadow-blue-50 px-5 py-4 hover:shadow-md transition-shadow"
            >
              {/* Left: seat info */}
              <div className="flex items-center gap-4">
                {/* Seat badge */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200">
                  <span className="text-white font-bold text-sm font-body">
                    {b.seat_number}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 font-body text-sm">
                    Seat {b.seat_number}
                  </p>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    📅{" "}
                    {new Date(b.booking_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Right: cancel button */}
              <button
                onClick={() => handleCancel(b.id)}
                disabled={cancellingId === b.id}
                className="text-xs font-semibold font-body px-4 py-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white border border-red-100 hover:border-transparent transition-all duration-200 disabled:opacity-50"
              >
                {cancellingId === b.id ? "Cancelling" : "Cancell"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}