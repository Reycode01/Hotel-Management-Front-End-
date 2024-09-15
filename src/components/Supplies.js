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
  const [supplies, setSupplies] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  // Fetch supplies from backend when component mounts
  useEffect(() => {
    fetchSupplies();
  }, []);

  // Fetch supplies from the backend
  const fetchSupplies = async () => {
    try {
      const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/supplies');
      setSupplies(response.data);
    } catch (error) {
      console.error('Failed to fetch supplies', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    try {
      const formattedAmount = parseFloat(amount);
      const formattedQuantity = parseFloat(quantity);

      // Validate fields
      if (!supplyName || isNaN(formattedAmount) || isNaN(formattedQuantity) || !unit || !supplyDate) {
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

      // Post new supply to backend
      await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/supplies', newSupply);

      setSuccessMessage('Supply added successfully!');
      setErrorMessage('');
      fetchSupplies(); // Refresh the list
      resetForm(); // Reset form fields
    } catch (error) {
      console.error('Error adding supply', error);
      setErrorMessage('Failed to add supply.');
    }
  };

  // Reset form after submission
  const resetForm = () => {
    setSupplyName('');
    setAmount('');
    setQuantity('');
    setUnit('');
    setSupplyDate('');
  };

  // Handle supply deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/supplies/${id}`);
      setSuccessMessage('Supply deleted successfully!');
      fetchSupplies(); // Refresh the list
    } catch (error) {
      console.error('Error deleting supply', error);
      setErrorMessage('Failed to delete supply.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daily Supplies</h2>
      
      {/* Add New Supply Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Supply</h3>
        
        {/* Success/Error Messages */}
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

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Supply Name</label>
          <input
            type="text"
            value={supplyName}
            onChange={(e) => setSupplyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter supply name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Amount (Ksh)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter total cost"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter quantity"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter unit (e.g., kg, g, liters)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Supply Date</label>
          <input
            type="date"
            value={supplyDate}
            onChange={(e) => setSupplyDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-md"
          >
            Add Supply
          </button>
        </div>
      </div>

      {/* Supplies List Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 max-w-full mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Supplies List</h3>

        {supplies.length === 0 ? (
          <p className="text-gray-600">No supplies added yet.</p>
        ) : (
          <ul className="space-y-4">
            {supplies.map((supply) => (
              <li key={supply.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{supply.name}</p>
                  <p className="text-sm text-gray-600">
                    Amount: Ksh {supply.amount}, Quantity: {supply.quantity} {supply.unit}, Date: {supply.supply_date}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
                  onClick={() => handleDelete(supply.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Supplies;

