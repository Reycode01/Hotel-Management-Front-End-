import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Supplies = () => {
  const [supplyName, setSupplyName] = useState('');
  const [amount, setAmount] = useState(''); // Total cost in Ksh
  const [quantity, setQuantity] = useState(''); // Quantity of the supply
  const [unit, setUnit] = useState(''); // Flexible unit input
  const [supplyDate, setSupplyDate] = useState(''); // New date field
  const [supplies, setSupplies] = useState([]); // State to hold the supplies list
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    fetchSupplies(); // Fetch supplies when the component mounts
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setUnit(''); // Reset unit on tab change
    setSupplyName('');
    setAmount('');
    setQuantity('');
    setSupplyDate('');
    setSuccessMessage(''); // Clear success message on tab change
    setErrorMessage(''); // Clear error message on tab change
  };

  const handleSubmit = async () => {
    try {
      const formattedAmount = parseFloat(amount);
      const formattedQuantity = parseFloat(quantity);

      // Validate fields
      if (!supplyName.trim() || isNaN(formattedAmount) || isNaN(formattedQuantity) || !unit || !supplyDate) {
        setErrorMessage('Please fill in all fields correctly.');
        return;
      }

      // Create supply object
      const newSupply = {
        name: supplyName,
        amount: formattedAmount,
        quantity: formattedQuantity,
        unit,
        supplyDate,
      };

      // Update URL to match your backend endpoint
      await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/supplies', newSupply);

      // Display success message
      setSuccessMessage('Supply added successfully!');

      // Reset the form fields
      setSupplyName('');
      setAmount('');
      setQuantity('');
      setUnit('');
      setSupplyDate('');

      // Fetch the updated supplies list
      fetchSupplies();
    } catch (error) {
      console.error('Failed to add supplies. Please try again.', error);
      setErrorMessage('An error occurred while adding the supply.');
    }
  };

  const fetchSupplies = async () => {
    try {
      const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/supplies');
      setSupplies(response.data); // Update the supplies state with the fetched data
    } catch (error) {
      console.error('Failed to fetch supplies:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center" style={{ fontFamily: 'Carrington, sans-serif' }}>
        Daily Supplies
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Tab Buttons */}
          <button
            onClick={() => handleTabClick('meat')}
            className={`flex-1 p-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 focus:outline-none ${activeTab === 'meat' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-400'}`}
          >
            Meat
          </button>
          {/* Other tab buttons */}
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Supply</h3>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-gradient-to-l from-green-500 to-green-700 transition-colors"
        >
          Add Supplies
        </button>

        {/* Supplies List */}
        <h3 className="text-2xl font-semibold mt-8 text-gray-800">Supplies List</h3>
        {supplies.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {supplies.map((supply, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <strong>{supply.name}</strong> - {supply.quantity} {supply.unit} @ {supply.amount} Ksh (Date: {new Date(supply.supplyDate).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No supplies available. Please add a new supply.</p>
        )}
      </div>
    </div>
  );
};

export default Supplies;

