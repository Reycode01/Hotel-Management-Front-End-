import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  { name: 'Presidential Penthouse', price: 6000 },
];

const RoomBooking = () => {
  const [rooms, setRooms] = useState(roomsList.map(room => ({ ...room, booked: false })));
  const [customerName, setCustomerName] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (bookingDate) {
      fetchRoomBookings();
    }
  }, [bookingDate]);

  const fetchRoomBookings = async () => {
    try {
      const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/room-bookings', {
        params: { bookingDate }
      });

      const bookedRooms = response.data;

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
    setShowBookingForm(true); // Show booking form
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
      setShowBookingForm(false); // Close booking form
      fetchRoomBookings();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred while submitting the booking.');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="relative p-4 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-4 text-center" style={{ color: '#24f21d' }}>
        Room Booking
      </h2>

      {/* Room List */}
      {!showBookingForm && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {rooms.map((room) => (
            <button
              key={room.name}
              onClick={() => handleRoomClick(room)}
              disabled={room.booked}
              className={`flex items-center justify-between p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg text-sm sm:text-base ${
                room.booked
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gray-800 font-bold'
              }`}
            >
              <span style={{ color: '#24f21d' }}>{room.name}</span>
              <span className="text-white">Ksh.{room.price}</span>
            </button>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl max-w-md mx-auto border border-gray-500">
            <h3 className="text-2xl font-semibold mb-2 text-white">Booking Form</h3>
            <label className="block mb-2">
              <span className="text-gray-300 font-medium">Customer Name:</span>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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
                onChange={(e) => setBookingAmount(e.target.value)}
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
                onChange={(e) => setBookingDate(e.target.value)}
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
            {errorMessage && (
              <p className="mt-4 text-red-500 font-semibold">{errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;




