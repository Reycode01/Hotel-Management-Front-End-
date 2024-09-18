import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Supplies = () => {
  const [supplyName, setSupplyName] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Units');
  const [supplyDate, setSupplyDate] = useState('');
  const [supplies, setSupplies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/supplies');
        if (response.data && Array.isArray(response.data.supplies)) {
          setSupplies(response.data.supplies.map(supply => ({
            ...supply,
            amount: supply.amount || 0,
            quantity: supply.quantity || 0,
            supplyDate: supply.supply_date ? new Date(supply.supply_date).toISOString().split('T')[0] : ''
          })));
        } else {
          setSupplies([]);
        }
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching supplies:', error);
        setErrorMessage('Failed to fetch supplies.');
      }
    };

    fetchSupplies();
  }, []);

  const handleAddSupply = async () => {
    if (!supplyName || amount <= 0 || quantity <= 0 || !unit || !supplyDate) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const newSupply = {
      name: supplyName,
      amount: Number(amount),
      quantity: Number(quantity),
      unit,
      supply_date: supplyDate
    };

    try {
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/supplies', newSupply);
      if (response.status === 201) {
        setSupplies(prevSupplies => [...prevSupplies, {
          ...newSupply,
          id: response.data.id // Assuming the response returns the new supply ID
        }]);
        setSuccessMessage('Supply added successfully!');
        setErrorMessage('');

        // Reset form fields
        setSupplyName('');
        setAmount('');
        setQuantity('');
        setUnit('Units');
        setSupplyDate('');
      } else {
        setErrorMessage('Failed to add supply. Please try again.');
      }
    } catch (error) {
      console.error('Error adding supply:', error);
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Failed to add supply. Please try again.');
      } else {
        setErrorMessage('Network error: Failed to connect to server.');
      }
      setSuccessMessage('');
    }
  };

  const handleDeleteSupply = async (id) => {
    try {
      const response = await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/supplies/${id}`);
      if (response.status === 200) {
        setSupplies(prevSupplies => prevSupplies.filter(supply => supply.id !== id));
        setSuccessMessage('Supply deleted successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to delete supply. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      setErrorMessage('Failed to delete supply.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-200">
      <h2 
        className="text-2xl font-bold mb-6 text-center text-green-500"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Daily Supplies
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-orange-500">Supply Name</label>
            <input
              type="text"
              value={supplyName}
              onChange={(e) => setSupplyName(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter supply name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-orange-500">Amount (Ksh)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter amount"
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-orange-500">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter quantity"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-orange-500">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Units">Units</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              {/* Add more units as needed */}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-orange-500">Supply Date</label>
          <input
            type="date"
            value={supplyDate}
            onChange={(e) => setSupplyDate(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          onClick={handleAddSupply}
          className="w-full mt-4 p-1 bg-orange-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500"
        >
          Add Supply
        </button>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>

      {/* Display supplies */}
      <div className="mt-8">
        <h3 className="text-1xl mb-1 text-orange-500">Existing Supplies</h3>
        <ul className="space-y-4">
          {supplies.map((supply) => (
            <li key={supply.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
              <div>
                <p><strong>Supply Name:</strong> {supply.name}</p>
                <p><strong>Amount:</strong> Ksh {supply.amount.toFixed(2)}</p>
                <p><strong>Quantity:</strong> {supply.quantity} {supply.unit}</p>
                <p><strong>Date:</strong> {new Date(supply.supply_date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDeleteSupply(supply.id)}
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

export default Supplies;
