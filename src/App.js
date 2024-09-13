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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <header className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 mb-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2" style={{ fontFamily: 'Brush Script MT, cursive', textShadow: '2px 2px 4px #000000' }}>
          Hotel Budget Management
        </h1>
        <p className="text-lg italic font-light">Manage your hotel finances with ease and style.</p>
      </header>
      <main className="space-y-8">
        <RoomBooking onBooking={handleRoomBooking} />
        <FoodOrder onOrder={handleFoodOrder} />
        <Supplies onSupply={handleSupply} />
        <Salaries onSalary={handleSalary} />
      </main>
    </div>
  );
};

export default App;

