import React, { useState, useEffect } from 'react';
import axios from 'axios';

import RoomBooking from './components/RoomBooking';
import FoodOrder from './components/FoodOrder';
import Supplies from './components/Supplies';
import Salaries from './components/Salaries';

axios.defaults.baseURL = 'https://hotel-management-backend-8.onrender.com';

const App = () => {
  const [data, setData] = useState({
    roomsBooked: { count: 0, totalAmount: 0 },
    foodOrders: { count: 0, totalAmount: 0 },
    supplies: { count: 0, totalAmount: 0 },
    salaries: { count: 0, totalAmount: 0 },
    totalIncome: 0,
    totalExpenditure: 0,
    profitOrLoss: 0,
  });

  const fetchData = async () => {
    try {
      const [roomsRes, foodsRes, suppliesRes, salariesRes] = await Promise.all([
        axios.get('/api/room-bookings'),
        axios.get('/api/food-orders'),
        axios.get('/api/supplies'),
        axios.get('/api/salaries'),
      ]);

      const bookings    = roomsRes.data.bookings    || [];
      const foodOrders  = foodsRes.data.foodOrders  || [];
      const suppliesArr = suppliesRes.data.supplies || [];
      const salariesArr = salariesRes.data.salaries || [];

      const roomsTotal   = bookings.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
      const foodsTotal   = foodOrders.reduce((sum, f) => sum + parseFloat(f.beverage_quantity || 0), 0);
      const suppliesTotal= suppliesArr.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
      const salariesTotal= salariesArr.reduce((sum, s) => sum + parseFloat(s.total_pay || 0), 0);

      setData({
        roomsBooked: { count: bookings.length, totalAmount: roomsTotal },
        foodOrders:  { count: foodOrders.length, totalAmount: foodsTotal },
        supplies:    { count: suppliesArr.length, totalAmount: suppliesTotal },
        salaries:    { count: salariesArr.length, totalAmount: salariesTotal },
        totalIncome:      roomsTotal + foodsTotal,
        totalExpenditure: suppliesTotal + salariesTotal,
        profitOrLoss:     roomsTotal + foodsTotal - (suppliesTotal + salariesTotal),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Re-fetch summary after any child posts
  const updateData = endpoint => async postData => {
    try {
      await axios.post(`/api/${endpoint}`, postData);
      await fetchData();
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8 flex flex-col justify-between">
      <header className="from-green-400 to-blue-500 text-white p-6">
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
          className="text-lg italic font-light text-yellow-300 to-yellow-600"
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
        <section className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md text-white">
          <h2 className="text-xl font-bold mb-2">Summary</h2>
          <p>Total Income: KES {data.totalIncome.toFixed(2)}</p>
          <p>Total Expenditure: KES {data.totalExpenditure.toFixed(2)}</p>
          <p>
            Profit or Loss:{' '}
            <span className={data.profitOrLoss >= 0 ? 'text-green-200' : 'text-red-200'}>
              KES {data.profitOrLoss.toFixed(2)}
            </span>
          </p>
        </section>

        {/* Pass handlers into your unchanged styled components */}
        <RoomBooking onBooking={updateData('room-bookings')} />
        <FoodOrder   onOrder={updateData('food-orders')}     />
        <Supplies    onSupply={updateData('supplies')}       />
        <Salaries    onSalary={updateData('salaries')}       />
      </main>

      <footer className="text-center text-yellow-400 py-4 mt-2">
        <p>© 2025 Humphrey's Dev Studio. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
