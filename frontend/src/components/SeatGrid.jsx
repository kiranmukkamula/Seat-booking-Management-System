import { useState, useEffect } from "react";
import { getSeatsByDate, bookSeat } from "../services/api";

export default function SeatGrid() {
  // Today's date in YYYY-MM-DD format as default
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [seats, setSeats] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null); // seat being booked

  // Fetch seats whenever date changes
  useEffect(() => {
    fetchSeats();
  }, [date]);

  const fetchSeats = async () => {
    setLoading(true);
    const data = await getSeatsByDate(date);
    setSeats(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // Book a seat by its id
  const handleBook = async (seat) => {
    if (seat.user_id) return; // already booked, ignore click
    setBookingId(seat.seat_number);
    setMsg("");
    const data = await bookSeat(seat.seat_number, date);
    setMsg(data.message);
    setBookingId(null);
    fetchSeats(); // refresh grid
  };

  // Split seats into rows of 6
  const rows = [];
  for (let i = 0; i < seats.length; i += 6) {
    rows.push(seats.slice(i, i + 6));
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800">
          Book a Seat
        </h2>
        <p className="text-gray-400 text-sm mt-1 font-body">
          Pick a date and tap any available seat to book it
        </p>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">
          Date
        </label>
        <input
          type="date"
          value={date}
          min={today}
          // max={today}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm text-gray-700 font-body transition"
        />
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300" />
          <span className="text-xs text-gray-500 font-body">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-pink-400 to-rose-500" />
          <span className="text-xs text-gray-500 font-body">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400 to-teal-400" />
          <span className="text-xs text-gray-500 font-body">Your seat</span>
        </div>
      </div>

      {/* Feedback message */}
      {msg && (
        <div
          className={`mb-4 text-sm py-3 px-5 rounded-xl font-body ${
            msg.toLowerCase().includes("success")
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-red-50 text-red-500 border border-red-100"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Seat Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-lg shadow-pink-50 p-6">
          {/* Screen indicator */}
          <div className="w-full h-2 bg-gradient-to-r from-pink-200 via-blue-300 to-indigo-200 rounded-full mb-8 opacity-80" />
          <p className="text-center text-xs text-gray-400 -mt-6 mb-8 font-body tracking-widest uppercase">
            Screen
          </p>

          {/* Rows of seats */}
          <div className="space-y-3">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-3">
                {/* Row label */}
                <span className="w-5 flex items-center justify-center text-xs text-gray-300 font-body">
                  {String.fromCharCode(65 + rowIdx)}
                </span>

                {row.map((seat) => {
                  const isBooked = !!seat.user_id;
                  const isBooking = bookingId === seat.seat_number;

                  return (
                    <button
                      key={seat.seat_number}
                      onClick={() => handleBook(seat)}
                      disabled={isBooked || isBooking}
                      title={
                        isBooked
                          ? `Seat ${seat.seat_number} - Booked`
                          : `Seat ${seat.seat_number} - Available`
                      }
                      className={`
                        w-11 h-11 rounded-xl text-xs font-semibold font-body transition-all duration-200 relative
                        ${
                          isBooking
                            ? "bg-yellow-100 border-2 border-yellow-300 text-yellow-600 scale-95"
                            : isBooked
                            ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md shadow-pink-200 cursor-not-allowed"
                            : "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 text-blue-600 hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 cursor-pointer"
                        }
                      `}
                    >
                      {isBooking ? "…" : seat.seat_number}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Seat count */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400 font-body">
            <span>
              {seats.filter((s) => !s.user_id).length} seats available
            </span>
            <span>{seats.filter((s) => s.user_id).length} booked</span>
          </div>
        </div>
      )}
    </div>
  );
}