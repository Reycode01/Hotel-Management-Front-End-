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

  // Fetch food orders from the backend
  useEffect(() => {
    const fetchFoodOrders = async () => {
      try {
        const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/food-orders');
        setFoodOrders(response.data.foodOrders || []);
      } catch (error) {
        console.error('Error fetching food orders:', error);
        setErrorMessage('Failed to fetch food orders.');
      }
    };

    fetchFoodOrders();
  }, []);

  const handleAddFoodOrder = async () => {
    if (!foodType || quantity <= 0 || !beverage || beverageQuantity < 0 || !orderDate) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const newFoodOrder = {
      foodType,
      quantity: Number(quantity),
      beverage,
      beverageQuantity: Number(beverageQuantity),
      orderDate
    };

    try {
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/food-orders', newFoodOrder);

      if (response.status === 201) {
        setFoodOrders([...foodOrders, { ...newFoodOrder, id: response.data.id }]);
        setSuccessMessage('Food order added successfully!');
        setErrorMessage('');

        setFoodType('Meat');
        setQuantity('');
        setBeverage('Water');
        setBeverageQuantity('');
        setOrderDate('');
      } else {
        setErrorMessage('Failed to add food order. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to add food order. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/food-orders/${id}`);
      setFoodOrders(foodOrders.filter(order => order.id !== id));
      setSuccessMessage('Food order deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete food order. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 via-yellow-200 to-red-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center" style={{ fontFamily: "'Dancing Script', cursive" }}>
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
        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}
        <div className="flex justify-center">
          <button onClick={handleAddFoodOrder} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            Add Order
          </button>
        </div>

        {/* Display food orders */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Food Orders List</h3>
          {foodOrders.length === 0 ? (
            <p>No food orders available.</p>
          ) : (
            <ul className="space-y-4">
              {foodOrders.map((order) => (
                <li key={order.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
                  <span>{order.foodType} - {order.quantity} {order.foodType === 'Vegetables' ? 'grams' : 'kg'}, {order.beverage} - {order.beverageQuantity} liters, Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;


