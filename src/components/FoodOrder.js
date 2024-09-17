import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodOrder = () => {
  const [foodType, setFoodType] = useState('Meat');
  const [quantity, setQuantity] = useState('');
  const [beverage, setBeverage] = useState('Water');
  const [beverageQuantity, setBeverageQuantity] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [foodOrders, setFoodOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFoodOrders();
  }, []);

  const fetchFoodOrders = async () => {
    try {
      const response = await axios.get('/api/food-orders');
      setFoodOrders(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch food orders.');
    }
  };

  const handleAddFoodOrder = async () => {
    if (!foodType || !quantity || !beverage || !beverageQuantity || !orderDate) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    const newOrder = {
      food_type: foodType,
      quantity: parseFloat(quantity),
      beverage,
      beverage_quantity: parseFloat(beverageQuantity),
      order_date: new Date(orderDate).toISOString(),  // Ensure the date is properly formatted
    };

    try {
      const response = await axios.post('/api/food-orders', newOrder);
      setFoodOrders([...foodOrders, response.data]);  // Add the new order to the current state
      setSuccessMessage('Food order added successfully!');
      setErrorMessage('');
      // Clear form fields
      setFoodType('Meat');
      setQuantity('');
      setBeverage('Water');
      setBeverageQuantity('');
      setOrderDate('');
    } catch (error) {
      setErrorMessage('Failed to add food order.');
      setSuccessMessage('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/food-orders/${id}`);
      setFoodOrders(foodOrders.filter(order => order.id !== id));  // Remove the order from the list
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to delete food order.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
        Daily Food Orders
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Food Type Section */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Food Type</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Meat">Meat</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>
          {/* Quantity Section */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Quantity (kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity in kg"
              min="0"
            />
          </div>
        </div>
        {/* Beverage Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
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
            <label className="block text-sm font-medium mb-2 text-gray-700">Beverage Quantity (litres)</label>
            <input
              type="number"
              value={beverageQuantity}
              onChange={(e) => setBeverageQuantity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter beverage quantity in litres"
              min="0"
            />
          </div>
        </div>
        {/* Date Section */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Add Order Button */}
        <button
          onClick={handleAddFoodOrder}
          className="mt-4 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600"
        >
          Add Food Order
        </button>
        {/* Success/Error Messages */}
        {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </div>
      {/* List of Food Orders */}
      <h3 className="mt-8 text-2xl font-bold mb-4 text-gray-800 text-center" style={{ fontFamily: "'Dancing Script', cursive" }}>
        Orders
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {foodOrders.map((order) => (
          <div key={order.id} className="bg-yellow-200 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p><strong>Food Type:</strong> {order.food_type}</p>
              <p><strong>Quantity:</strong> {order.quantity} kg</p>
              <p><strong>Beverage:</strong> {order.beverage}</p>
              <p><strong>Beverage Quantity:</strong> {order.beverage_quantity} litres</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p> {/* Format Date */}
            </div>
            <button
              onClick={() => handleDelete(order.id)}
              className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodOrder;


