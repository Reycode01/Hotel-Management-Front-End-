import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Fetch food orders when the component mounts
    const fetchFoodOrders = async () => {
      try {
        const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/food-orders');
        if (response.data && response.data.foodOrders) {
          setFoodOrders(response.data.foodOrders);
        } else {
          setFoodOrders([]);
        }
      } catch (error) {
        console.error('Error fetching food orders:', error);
        setErrorMessage('Failed to fetch food orders.');
      }
    };

    fetchFoodOrders();
  }, []); // Empty dependency array to run once on mount

  const handleAddFoodOrder = async () => {
    // Basic front-end validation
    if (!foodType || quantity <= 0 || !beverage || (beverageQuantity !== '' && beverageQuantity < 0) || !orderDate) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const newFoodOrder = {
      foodType,
      quantity: Number(quantity),
      beverage,
      beverageQuantity: beverageQuantity === '' ? null : Number(beverageQuantity),
      orderDate
    };

    try {
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/food-orders', newFoodOrder);
      if (response.status === 201) {
        // Update the order list
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
        setErrorMessage('Failed to add food order. Please try again.');
      }
    } catch (error) {
      console.error('Error adding food order:', error);
      if (error.response) {
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
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Order List</h3>
          <ul>
            {foodOrders.length > 0 ? (
              foodOrders.map((order, index) => (
                <li key={index} className="bg-white p-4 mb-2 rounded-lg shadow-md">
                  <p><strong>Food Type:</strong> {order.foodType}</p>
                  <p><strong>Quantity:</strong> {order.quantity} {order.foodType === 'Vegetables' ? 'grams' : 'kg'}</p>
                  <p><strong>Beverage:</strong> {order.beverage}</p>
                  <p><strong>Beverage Quantity:</strong> {order.beverageQuantity} liters</p>
                  <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <p>No orders yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;




