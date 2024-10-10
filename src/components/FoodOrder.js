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
        const response = await axios.get('https://hotel-management-backend-2-b21q.onrender.com/api/food-orders');
        if (response.data && Array.isArray(response.data.foodOrders)) {
          setFoodOrders(response.data.foodOrders.map(order => ({
            ...order,
            quantity: order.quantity || 0,
            beverageQuantity: order.beverage_quantity || 0,
            orderDate: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : '', // Proper date formatting
            foodType: order.food_type // Ensure foodType is displayed correctly
          })));
        } else {
          setFoodOrders([]);
        }
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching food orders:', error);
        setErrorMessage();
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
      orderDate
    };

    try {
      const response = await axios.post('https://hotel-management-backend-2-b21q.onrender.com/api/food-orders', newFoodOrder);
      if (response.status === 201) {
        setFoodOrders(prevOrders => [...prevOrders, {
          ...newFoodOrder,
          id: response.data.id, // Assuming the response returns the new order ID
          foodType: newFoodOrder.foodType
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
      const response = await axios.delete(`https://hotel-management-backend-2-b21q.onrender.com/api/food-orders/${id}`);
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
    <div className="p-6 bg-gray-900 text-gray-200">
      <h2 
        className="text-2xl font-bold mb-6 text-center text-yellow-300"
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
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-yellow-300">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          onClick={handleAddFoodOrder}
          className="w-full mt-4 p-1 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500"
        >
          Add Food Order
        </button>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>

      {/* Display food orders */}
      <div className="mt-8">
        <h3 className="text-1xl mb-1 text-yellow-300">Existing Orders</h3>
        <ul className="space-y-4">
          {foodOrders.map((order) => (
            <li key={order.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
              <div>
                <p><strong>Food Type:</strong> {order.foodType}</p>
                <p><strong>Quantity:</strong> {order.quantity} {order.foodType === 'Vegetables' ? 'grams' : 'kg'}</p>
                <p><strong>Beverage:</strong> {order.beverage} ({order.beverageQuantity} liters)</p>
                <p><strong>Order Date:</strong> {order.orderDate}</p>
              </div>
              <button
                onClick={() => handleDeleteFoodOrder(order.id)}
                className="ml-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodOrder;
