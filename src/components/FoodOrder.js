import React, { useState } from 'react';
import axios from 'axios';

const FoodOrder = ({ onAddFoodOrder }) => {
  const [foodType, setFoodType] = useState('Meat');
  const [quantity, setQuantity] = useState('');
  const [beverage, setBeverage] = useState('Water');
  const [beverageQuantity, setBeverageQuantity] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [foodOrders, setFoodOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddFoodOrder = async () => {
    // Basic front-end validation
    if (!foodType || quantity <= 0 || !beverage || beverageQuantity < 0 || !orderDate) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const newFoodOrder = {
      foodType,
      quantity: Number(quantity),
      beverage,
      beverageQuantity: Number(beverageQuantity),
      orderDate // Include the date in the payload
    };

    try {
      console.log('Sending food order data:', newFoodOrder);

      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/food-orders', newFoodOrder);

      console.log('Response from server:', response);

      if (response.status === 201) {
        setFoodOrders([...foodOrders, newFoodOrder]);
        if (typeof onAddFoodOrder === 'function') {
          onAddFoodOrder(newFoodOrder);
        } else {
          console.error('onAddFoodOrder is not a function');
        }
        setSuccessMessage('Food order added successfully!');
        setErrorMessage('');

        // Reset form fields
        setFoodType('Meat');
        setQuantity('');
        setBeverage('Water');
        setBeverageQuantity('');
        setOrderDate('');
      } else {
        console.error('Unexpected response status:', response.status);
        setErrorMessage('Failed to add food order. Please try again.');
      }
    } catch (error) {
      console.error('Error adding food order:', error);
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
        setErrorMessage(error.response.data.error || 'Failed to add food order. Please try again.');
      } else {
        setErrorMessage('Network error: Failed to connect to server.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 via-yellow-200 to-red-300">
      <h2 
        className="text-3xl font-bold mb-6 text-gray-800 text-center"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Daily Food Orders
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Food Type</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Meat">Meat</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Cereals">Cereals</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Quantity ({foodType === 'Vegetables' ? 'grams' : 'kg'})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter quantity in ${foodType === 'Vegetables' ? 'grams' : 'kg'}`}
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Beverage Type</label>
            <select
              value={beverage}
              onChange={(e) => setBeverage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Water">Water</option>
              <option value="Soda">Soda</option>
              <option value="Juice">Juice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Beverage Quantity (liters)
            </label>
            <input
              type="number"
              value={beverageQuantity}
              onChange={(e) => setBeverageQuantity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter beverage quantity"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleAddFoodOrder}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;
