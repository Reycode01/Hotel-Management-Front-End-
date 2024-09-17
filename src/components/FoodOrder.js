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
    const fetchFoodOrders = async () => {
      try {
        const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/food-orders');
        if (response.data && response.data.foodOrders) {
          setFoodOrders(response.data.foodOrders);
        } else {
          setFoodOrders([]);
        }
        setErrorMessage('');
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
        {/* Form for adding new food orders */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Food Type Select */}
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
          {/* Quantity Input */}
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
        {/* Beverage Section */}
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
        <div>
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
        {foodOrders.length > 0 ? (
          foodOrders.map((order) => (
            <div key={order.id} className="bg-yellow-200 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Food Type:</strong> {order.food_type}</p>
                <p><strong>Quantity:</strong> {order.quantity} kg</p>
                <p><strong>Beverage:</strong> {order.beverage}</p>
                <p><strong>Beverage Quantity:</strong> {order.beverage_quantity || 'N/A'} litres</p>
                <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString() || 'N/A'}</p>
              </div>
              <button
                onClick={() => handleDelete(order.id)}
                className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default FoodOrder;





