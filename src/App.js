import React, { useState, useEffect } from 'react';
import axios from 'axios';

import RoomBooking from './components/RoomBooking';
import FoodOrder from './components/FoodOrder';
import Supplies from './components/Supplies';
import Salaries from './components/Salaries';

// point ALL axios calls to your backend
axios.defaults.baseURL = 'https://hotel-management-backend-8.onrender.com';

export default function App() {
  const [data, setData] = useState({
    roomsBooked: { count: 0, totalAmount: 0 },
    foodOrders: { count: 0, totalAmount: 0 },
    supplies: { count: 0, totalAmount: 0 },
    salaries: { count: 0, totalAmount: 0 },
    totalIncome: 0,
    totalExpenditure: 0,
    profitOrLoss: 0,
  });

  // Load summary data
  const fetchData = async () => {
    try {
      const [r, f, s, sal] = await Promise.all([
        axios.get('/api/room-bookings'),
        axios.get('/api/food-orders'),
        axios.get('/api/supplies'),
        axios.get('/api/salaries'),
      ]);

      const bookings    = r.data.bookings    || [];
      const foodOrders  = f.data.foodOrders  || [];
      const suppliesArr = s.data.supplies    || [];
      const salariesArr = sal.data.salaries  || [];

      const roomsTotal    = bookings.reduce((sum, x) => sum + +x.amount, 0);
      const foodsTotal    = foodOrders.reduce((sum, x) => sum + +x.beverage_quantity, 0);
      const suppliesTotal = suppliesArr.reduce((sum, x) => sum + +x.amount, 0);
      const salariesTotal = salariesArr.reduce((sum, x) => sum + +x.total_pay, 0);

      setData({
        roomsBooked:    { count: bookings.length, totalAmount: roomsTotal },
        foodOrders:     { count: foodOrders.length, totalAmount: foodsTotal },
        supplies:       { count: suppliesArr.length, totalAmount: suppliesTotal },
        salaries:       { count: salariesArr.length, totalAmount: salariesTotal },
        totalIncome:      roomsTotal  + foodsTotal,
        totalExpenditure: suppliesTotal + salariesTotal,
        profitOrLoss:     roomsTotal  + foodsTotal - (suppliesTotal + salariesTotal),
      });
    } catch (e) {
      console.error('Summary fetch failed:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // create a handler to POST and then refresh summary
  const handlePost = endpoint => async payload => {
    try {
      const res = await axios.post(`/api/${endpoint}`, payload);
      if (res.data.error) throw new Error(res.data.error);
      await fetchData();
    } catch (err) {
      // re–throw so RoomBooking can catch/display
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8 flex flex-col justify-between">
      <header className="text-white p-6">
        <h1
          className="text-3xl font-extrabold text-yellow-900"
          style={{
            fontFamily: "'Dancing Script', cursive",
            textShadow: '6px 7px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          Hotel Budget Management
        </h1>
        <p
          className="text-lg italic font-light text-yellow-300"
          style={{
            fontFamily: "'Dancing Script', cursive",
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            lineHeight: '1.1',
          }}
        >
          Manage your hotel finances with ease and style.
        </p>
      </header>

      <main className="space-y-6">
        

        {/* pass in the POST handlers */}
        <RoomBooking   onBooking={handlePost('room-bookings')} />
        <FoodOrder     onOrder={handlePost('food-orders')}     />
        <Supplies      onSupply={handlePost('supplies')}       />
        <Salaries      onSalary={handlePost('salaries')}       />
      </main>

      <footer className="text-center text-yellow-400 py-4 mt-2">
        <p>© 2025 Humphrey's Dev Studio. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
