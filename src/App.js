import React, { useState, useEffect } from 'react';
import RoomBooking from './components/RoomBooking';
import FoodOrder from './components/FoodOrder';
import Supplies from './components/Supplies';
import Salaries from './components/Salaries';
import axios from 'axios';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, foods, supplies, salaries] = await Promise.all([
          axios.get('/api/room-bookings'),
          axios.get('/api/food-orders'),
          axios.get('/api/supplies'),
          axios.get('/api/salaries'),
        ]);

        const roomsBookedTotalAmount = rooms.data.bookings.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
        const foodOrdersTotalAmount = foods.data.foodOrders.reduce((sum, f) => sum + parseFloat(f.beverage_quantity || 0), 0);
        const suppliesTotalAmount = supplies.data.supplies.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
        const salariesTotalAmount = salaries.data.salaries.reduce((sum, s) => sum + parseFloat(s.total_pay || 0), 0);

        setData({
          roomsBooked: { count: rooms.data.bookings.length, totalAmount: roomsBookedTotalAmount },
          foodOrders: { count: foods.data.foodOrders.length, totalAmount: foodOrdersTotalAmount },
          supplies: { count: supplies.data.supplies.length, totalAmount: suppliesTotalAmount },
          salaries: { count: salaries.data.salaries.length, totalAmount: salariesTotalAmount },
          totalIncome: roomsBookedTotalAmount + foodOrdersTotalAmount,
          totalExpenditure: suppliesTotalAmount + salariesTotalAmount,
          profitOrLoss: (roomsBookedTotalAmount + foodOrdersTotalAmount) - (suppliesTotalAmount + salariesTotalAmount),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateData = async (endpoint, data) => {
    try {
      await axios.post(`/api/${endpoint}`, data);
      const response = await axios.get(`/api/${endpoint}`);
      const newData = response.data;

      const updatedCategoryData = {
        count: newData.length,
        totalAmount: newData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
      };

      setData(prevData => {
        const totalIncome = prevData.totalIncome + (endpoint === 'room-bookings' || endpoint === 'food-orders' ? updatedCategoryData.totalAmount : 0);
        const totalExpenditure = prevData.totalExpenditure + (endpoint === 'supplies' || endpoint === 'salaries' ? updatedCategoryData.totalAmount : 0);

        return {
          ...prevData,
          [endpoint]: updatedCategoryData,
          totalIncome,
          totalExpenditure,
          profitOrLoss: totalIncome - totalExpenditure,
        };
      });
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error.response?.data || error.message);
    }
  };

  const handleRoomBooking = (booking) => updateData('room-bookings', booking);
  const handleFoodOrder = (order) => updateData('food-orders', order);
  const handleSupply = (supply) => updateData('supplies', supply);
  const handleSalary = (salary) => updateData('salaries', salary);

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
      <main className="space-y-4">
        <RoomBooking onBooking={handleRoomBooking} />
        <FoodOrder onOrder={handleFoodOrder} />
        <Supplies onSupply={handleSupply} />
        <Salaries onSalary={handleSalary} />
      </main>
      <footer className="text-center text-yellow-400 py-4 mt-2">
        <p>© 2025 Humphrey's Dev Studio. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;

