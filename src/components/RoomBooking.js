import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configure base URL for all axios requests
axios.defaults.baseURL = 'https://hotel-management-backend-8.onrender.com';

const roomsList = [
  { name: 'Sapphire Suite', price: 1000 },
  { name: 'Emerald Haven', price: 2000 },
  { name: 'Ruby Retreat', price: 2500 },
  { name: 'Diamond Deluxe', price: 3000 },
  { name: 'Platinum Palace', price: 3500 },
  { name: 'Royal Residence', price: 4000 },
  { name: 'Majestic Manor', price: 4500 },
  { name: 'Opulent Oasis', price: 5000 },
  { name: 'Luxury Loft', price: 5500 },
  { name: 'Kings', price: 6000 },
];

const RoomBooking = () => {
  const [rooms, setRooms] = useState(
    roomsList.map(room => ({ ...room, booked: false }))
  );
  const [customerName, setCustomerName] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchRoomBookings = useCallback(async () => {
    if (!bookingDate) return;
    try {
      const response = await axios.get('/api/room-bookings', {
        params: { bookingDate },
      });

      const bookedRooms = Array.isArray(response.data.bookings)
        ? response.data.bookings
        : [];

      const updated = roomsList.map(room => ({
        ...room,
        booked: bookedRooms.some(
          ({ room_name, booking_date }) =>
            room_name === room.name && booking_date === bookingDate
        ),
      }));

      setRooms(updated);
      setErrorMessage('');
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage('Unable to fetch availability.');
    }
  }, [bookingDate]);

  useEffect(() => {
    fetchRoomBookings();
  }, [bookingDate, fetchRoomBookings]);

  const handleRoomClick = room => {
    if (room.booked) {
      setErrorMessage(`Room ${room.name} is already booked.`);
      return;
    }
    setSelectedRoom(room.name);
    setBookingAmount(String(room.price));
    setShowBookingForm(true);
    setErrorMessage('');
  };

  const isDateValid = d => {
    const today = new Date();
    const sel = new Date(d);
    return sel >= new Date(today.setHours(0, 0, 0, 0));
  };

    const handleBooking = async () => {
    const amt = Number(bookingAmount);
    if (!customerName || !amt || !selectedRoom || !bookingDate) {
      setErrorMessage('Please fill all fields.');
      return;
    }
    if (!isDateValid(bookingDate)) {
      setErrorMessage('Select today or future date.');
      return;
    }
    try {
      // POST booking
      const res = await onBooking({
        roomName: selectedRoom,
        customerName,
        amount: amt,
        bookingDate,
      });
      alert(res?.data?.message || 'Room was booked successfully!');
      // reset form
      setCustomerName('');
      setBookingAmount('');
      setSelectedRoom('');
      setBookingDate('');
      setShowBookingForm(false);
      fetchRoomBookings();
    } catch (err) {
      // Detailed error logging
      console.error('Booking error status:', err.response?.status);
      console.error('Booking error data:', err.response?.data);
      const serverMsg = err.response?.data?.error || JSON.stringify(err.response?.data);
      setErrorMessage(serverMsg || err.message || 'Booking failed.');
    }
  };

  return (
    <div className="relative p-1 bg-gray-900 rounded-xl shadow-lg">
      <h2
        className="text-2xl font-extrabold mb-1 text-center"
        style={{ color: '#24f21d', fontFamily: "'Dancing Script', cursive" }}
      >
        Room Booking
      </h2>

      {!showBookingForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-5 gap-4 mb-3">
          {rooms.map(room => (
            <button
              key={room.name}
              onClick={() => handleRoomClick(room)}
              disabled={room.booked}
              className={`flex items-center justify-between p-2 sm:p-3 md:p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm sm:text-base ${
                room.booked
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gray-800 font-bold'
              }`}
            >
              <span style={{ color: '#24f21d' }}>{room.name}</span>
              <span style={{ color: 'gold' }}>Ksh.{room.price}</span>
            </button>
          ))}
        </div>
      )}

      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto border border-gray-500">
            <h3 className="text-2xl font-semibold mb-2 text-white">Booking Form</h3>
            <label className="block mb-2">
              <span className="text-gray-300 font-medium">Customer Name:</span>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-500 rounded bg-gray-700 text-white focus:ring"
                style={{ borderColor: '#24f21d' }}
                placeholder="Enter customer's name"
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-300 font-medium">Booking Amount:</span>
              <input
                type="text"
                value={bookingAmount}
                onChange={e => setBookingAmount(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-500 rounded bg-gray-700 text-white focus:ring"
                style={{ borderColor: '#24f21d' }}
                placeholder="Enter booking amount"
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-300 font-medium">Booking Date:</span>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-500 rounded bg-gray-700 text-white focus:ring"
                style={{ borderColor: '#24f21d' }}
              />
            </label>
            <button
              onClick={handleBooking}
              className="w-full py-2 rounded-lg font-semibold transition-all ease-in-out duration-300"
              style={{ backgroundColor: '#24f21d', color: 'black' }}
            >
              Book Room
            </button>
            <button
              onClick={() => setShowBookingForm(false)}
              className="w-full py-2 mt-4 text-gray-400 hover:text-white transition-all ease-in-out duration-300"
            >
              Cancel
            </button>
            {errorMessage && <p className="mt-4 text-red-500 font-semibold">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;





