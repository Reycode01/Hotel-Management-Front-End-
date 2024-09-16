import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Supplies = () => {
  const [supplyName, setSupplyName] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [supplyDate, setSupplyDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('meat');
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    // Fetch supplies when the component mounts
    fetchSupplies();
  }, [activeTab]);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get(`https://hotel-management-backend-j1uy.onrender.com/api/supplies`);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
      setErrorMessage('An error occurred while fetching supplies.');
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const resetForm = () => {
    setSupplyName('');
    setAmount('');
    setQuantity('');
    setUnit('');
    setSupplyDate('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    try {
      const formattedAmount = parseFloat(amount);
      const formattedQuantity = parseFloat(quantity);

      if (!supplyName.trim() || isNaN(formattedAmount) || isNaN(formattedQuantity) || !unit || !supplyDate) {
        setErrorMessage('Please fill in all fields correctly.');
        return;
      }

      const newSupply = {
        name: supplyName,
        amount: formattedAmount,
        quantity: formattedQuantity,
        unit,
        supplyDate,
      };

      await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/supplies', newSupply);

      setSuccessMessage('Supply added successfully!');
      resetForm();
      fetchSupplies(); // Refresh supplies after adding
    } catch (error) {
      console.error('Failed to add supply:', error);
      setErrorMessage('An error occurred while adding the supply.');
    }
  };

  const handleDelete = async (supplyId) => {
    try {
      await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/supplies/${supplyId}`);
      setSuccessMessage('Supply deleted successfully!');
      fetchSupplies(); // Refresh supplies after deleting
    } catch (error) {
      console.error('Failed to delete supply:', error);
      setErrorMessage('An error occurred while deleting the supply.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center" style={{ fontFamily: 'Carrington, sans-serif' }}>
        Daily Supplies
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleTabClick('meat')}
            className={`flex-1 p-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'meat' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-400'
            }`}
          >
            Meat
          </button>
          {/* Add buttons for other categories */}
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Supply</h3>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Supply Name</label>
          <input
            type="text"
            value={supplyName}
            onChange={(e) => setSupplyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter supply name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Amount (Ksh)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total cost"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter quantity in ${unit}`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unit (e.g., kg, g, liters, crate)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Supply Date</label>
          <input
            type="date"
            value={supplyDate}
            onChange={(e) => setSupplyDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-gradient-to-l from-green-500 to-green-700 transition-colors"
        >
          Add Supplies
        </button>

        <h3 className="text-xl font-semibold mt-6 text-gray-800">Supplies for {activeTab}</h3>
        <ul className="mt-4">
          {supplies.map((supply) => (
            <li key={supply.id} className="bg-gray-100 p-3 rounded-lg mb-2 flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {supply.name}</p>
                <p><strong>Amount:</strong> Ksh {supply.amount}</p>
                <p><strong>Quantity:</strong> {supply.quantity} {supply.unit}</p>
                <p><strong>Date:</strong> {supply.supply_date}</p>
              </div>
              <button
                onClick={() => handleDelete(supply.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
