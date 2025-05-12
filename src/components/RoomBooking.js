import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomBooking = () => {
  const [roomName, setRoomName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [bookedRooms, setBookedRooms] = useState([]);

  // Fetch bookings when bookingDate changes
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/room-bookings', {
          params: { bookingDate },
        });
        setBookedRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    };

    if (bookingDate) fetchBookings();
  }, [bookingDate]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!roomName || !customerName || !amount || !bookingDate) {
      setResponseMessage('All fields are required.');
      return;
    }

    // Check for conflict before booking
    const isAlreadyBooked = bookedRooms.some(
      (booking) => booking.room_name === roomName
    );

    if (isAlreadyBooked) {
      setResponseMessage(`Room ${roomName} is already booked for ${bookingDate}.`);
      return;
    }

    try {
      const response = await axios.post('/api/room-bookings', {
        roomName,
        customerName,
        amount: parseFloat(amount),
        bookingDate,
      });

      setResponseMessage(response.data.message || 'Room booked successfully!');
      setRoomName('');
      setCustomerName('');
      setAmount('');
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || 'Error booking room. Try again.';
      setResponseMessage(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Book a Room</h2>
      <form onSubmit={handleBooking}>
        <div className="mb-4">
          <label className="block mb-1">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter room name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Booking Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Book Room
        </button>
      </form>

      {responseMessage && (
        <p className="mt-4 text-sm text-red-600">{responseMessage}</p>
      )}
    </div>
  );
};

export default RoomBooking;





