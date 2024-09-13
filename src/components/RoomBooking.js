import React, { useState, useEffect } from 'react';
import axios from 'axios';

const roomsList = [
  { name: 'Room 101', price: 2000 },
  { name: 'Room 102', price: 3000 },
  { name: 'Room 103', price: 2500 },
  { name: 'Room 104', price: 3500 },
  { name: 'Room 105', price: 5000 },
  { name: 'Room 106', price: 4000 },
  { name: 'Room 107', price: 4500 },
  { name: 'Room 108', price: 5500 },
  { name: 'Room 109', price: 6000 },
  { name: 'Room 110', price: 1000 },
];

const RoomBooking = () => {
  const [rooms, setRooms] = useState(roomsList.map(room => ({ ...room, booked: false })));
  const [customerName, setCustomerName] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (bookingDate) {
      fetchRoomBookings();
    }
  }, [bookingDate]);

  // Fetch booked rooms from the server
  const fetchRoomBookings = async () => {
    try {
      const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/room-bookings', {
        params: { bookingDate }
      });

      const bookedRooms = response.data;

      // Update room state based on booked rooms
      const updatedRooms = roomsList.map(room => ({
        ...room,
        booked: bookedRooms.some(booking => booking.room_name === room.name && booking.booking_date === bookingDate)
      }));

      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error fetching room bookings:', error);
    }
  };

  const handleRoomClick = (room) => {
    if (room.booked) {
      setErrorMessage(`Room ${room.name} is already booked for the selected date.`);
      return;
    }

    setSelectedRoom(room.name);
    setBookingAmount(String(room.price));
    setErrorMessage('');
  };

  const handleBooking = async () => {
    const bookingAmountNum = Number(bookingAmount.trim());

    if (customerName.trim() === '' || isNaN(bookingAmountNum) || selectedRoom.trim() === '' || !bookingDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/room-bookings', {
        roomName: selectedRoom,
        customerName,
        amount: bookingAmountNum,
        bookingDate
      });

      alert(response.data.message);
      setCustomerName('');
      setBookingAmount('');
      setSelectedRoom('');
      setBookingDate('');
      setErrorMessage('');
      fetchRoomBookings();  // Refresh room bookings from server
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred while submitting the booking.');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-xl shadow-lg">
      <h2 className="text-5xl font-extrabold mb-6 text-white text-center drop-shadow-lg">
        Room Booking
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {rooms.map((room) => (
          <button
            key={room.name}
            onClick={() => handleRoomClick(room)}
            disabled={room.booked}
            className={`flex items-center justify-between p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl ${room.booked ? 'bg-gray-600 cursor-not-allowed text-gray-300' : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'}`}
          >
            <span className="text-xl font-bold">{room.name}</span>
            <span className="text-lg font-semibold">Ksh.{room.price}</span>
          </button>
        ))}
      </div>
      {selectedRoom && (
        <div className="bg-white p-8 rounded-lg shadow-2xl mt-6 max-w-lg mx-auto border border-gray-300">
          <h3 className="text-3xl font-semibold mb-6 text-gray-800">Booking Form</h3>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Customer Name:</span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded focus:ring focus:ring-indigo-200"
              placeholder="Enter customer's name"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Booking Amount:</span>
            <input
              type="text"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded focus:ring focus:ring-indigo-200"
              placeholder="Enter booking amount"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Booking Date:</span>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded focus:ring focus:ring-indigo-200"
            />
          </label>
          <button
            onClick={handleBooking}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all ease-in-out duration-300"
          >
            Book Room
          </button>
          {errorMessage && (
            <p className="mt-4 text-red-500 font-semibold">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
