// Base URL for all API requests
const BASE_URL = "http://localhost:5000";

// Helper: get auth token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper: build headers with optional auth
const headers = (auth = false) => ({
  "Content-Type": "application/json",
  ...(auth && { Authorization: `Bearer ${getToken()}` }),
});

// --- AUTH ---

// Register a new user
export const registerUser = (name, email, password) =>
  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  }).then((r) => r.json());

// Login user and get token
export const loginUser = (email, password) =>
  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

// --- SEATS ---

// Get all seats with booking status for a specific date
export const getSeatsByDate = (date) =>
  fetch(`${BASE_URL}/seats/${date}`, { headers: headers() }).then((r) =>
    r.json()
  );

// Book a seat
export const bookSeat = (seat_id, booking_date) =>
  fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ seat_id, booking_date }),
  }).then((r) => r.json());

// --- BOOKINGS ---

// Get logged-in user's bookings
export const getMyBookings = () =>
  fetch(`${BASE_URL}/mybookings`, { headers: headers(true) }).then((r) =>
    r.json()
  );

// Cancel a booking by id
export const cancelBooking = (id) =>
  fetch(`${BASE_URL}/cancel/${id}`, {
    method: "POST",
    headers: headers(true),
  }).then((r) => r.json());