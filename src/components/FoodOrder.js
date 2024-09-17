import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodOrder = ({ onAddFoodOrder }) => {
  const [foodType, setFoodType] = useState('Meat'); // Default value
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
        if (response.data && Array.isArray(response.data.foodOrders)) {
          setFoodOrders(response.data.foodOrders.map(order => ({
            ...order,
            quantity: order.quantity || 0,
            beverageQuantity: order.beverage_quantity || 0,
            orderDate: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : '' // Proper date formatting
          })));
        } else {
          setFoodOrders([]);
        }
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching food orders:', error);
        setErrorMessage('Error fetching data from the server.');
      }
    };

    fetchFoodOrders();
  }, []);

  const handleAddFoodOrder = async () => {
    if (!foodType || quantity <= 0 || !beverage || (beverageQuantity !== '' && beverageQuantity < 0) || !orderDate) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const newFoodOrder = {
      foodType,
      quantity: Number(quantity),
      beverage,
      beverageQuantity: beverageQuantity === '' ? null : Number(beverageQuantity),
      orderDate // Corrected line
    };

    try {
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/food-orders', newFoodOrder);
      if (response.status === 201) {
        setFoodOrders(prevOrders => [...prevOrders, {
          ...newFoodOrder,
          id: response.data.id // Assuming the response returns the new order ID
        }]);
        if (typeof onAddFoodOrder === 'function') {
          onAddFoodOrder(newFoodOrder);
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

  const handleDeleteFoodOrder = async (id) => {
    try {
      const response = await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/food-orders/${id}`);
      if (response.status === 200) {
        setFoodOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        setSuccessMessage('Food order deleted successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to delete food order. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting food order:', error);
      setErrorMessage('Failed to delete food order.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h2 
        className="text-4xl font-bold mb-6 text-center text-yellow-300"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Daily Food Orders
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-300">Food Type</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Meat">Meat</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Cereals">Cereals</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-300">
              Quantity ({foodType === 'Vegetables' ? 'grams' : 'kg'})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder={`Enter quantity in ${foodType === 'Vegetables' ? 'grams' : 'kg'}`}
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-300">Beverage Type</label>
            <select
              value={beverage}
              onChange={(e) => setBeverage(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Water">Water</option>
              <option value="Soda">Soda</option>
              <option value="Juice">Juice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-300">
              Beverage Quantity (liters)
            </label>
            <input
              type="number"
              value={beverageQuantity}
              onChange={(e) => setBeverageQuantity(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter beverage quantity"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-300">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        {errorMessage && (
          <div className="bg-red-500 border border-red-700 text-white px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500 border border-green-700 text-white px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleAddFoodOrder}
            className="bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Add Order
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-yellow-300">Order List</h3>
          <ul>
            {foodOrders.length > 0 ? (
              foodOrders.map(order => (
                <li key={order.id} className="flex justify-between items-center bg-gray-700 p-4 mb-2 rounded-lg">
                  <div className="text-yellow-300">
                    <div>Food Type: {order.food_type}</div>
                    <div>Quantity: {order.quantity} {order.food_type === 'Vegetables' ? 'grams' : 'kg'}</div>
                    <div>Beverage: {order.beverage} ({order.beverage_quantity} liters)</div>
                    <div>Date: {order.order_date}</div> {/* Ensure date is correctly formatted */}
                  </div>
                  <button
                    onClick={() => handleDeleteFoodOrder(order.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400">No orders found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;











