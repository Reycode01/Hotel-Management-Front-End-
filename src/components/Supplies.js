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
  const [activeTab, setActiveTab] = useState('all'); // Default to showing all supplies
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    // Fetch supplies when the component mounts
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get(`https://hotel-management-backend-3.onrender.com/api/supplies`);
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

      await axios.post('https://hotel-management-backend-3.onrender.com/api/supplies', newSupply);

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
      await axios.delete(`https://hotel-management-backend-3.onrender.com/api/supplies/${supplyId}`);
      setSuccessMessage('Supply deleted successfully!');
      fetchSupplies(); // Refresh supplies after deleting
    } catch (error) {
      console.error('Failed to delete supply:', error);
      setErrorMessage('An error occurred while deleting the supply.');
    }
  };

  const filteredSupplies = supplies.filter((supply) => {
    if (activeTab === 'all') return true; // Show all supplies when 'all' is active
    return supply.name.toLowerCase().includes(activeTab);
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 min-h-screen">
      <h2
        className="text-2xl font-bold mb-6 text-orange-600 text-center"
        style={{ fontFamily: "'Dancing Script', cursive" }}  // Apply Dancing Script
      >
          Daily Supplies
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-full mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleTabClick('all')}
            className={`flex-1 p-3 rounded-lg text-yellow-300 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'all' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            All Supplies
          </button>
          <button
            onClick={() => handleTabClick('meat')}
            className={`flex-1 p-3 rounded-lg text-yellow-400 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'meat' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            Meat
          </button>
          <button
            onClick={() => handleTabClick('vegetables')}
            className={`flex-1 p-3 rounded-lg text-yellow-400 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'vegetables' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            Vegetables
          </button>
          <button
            onClick={() => handleTabClick('cereals')}
            className={`flex-1 p-3 rounded-lg text-yellow-400 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'cereals' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            Cereals
          </button>
          <button
            onClick={() => handleTabClick('detergents')}
            className={`flex-1 p-3 rounded-lg text-yellow-400 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'detergents' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            Detergents
          </button>
          <button
            onClick={() => handleTabClick('drinks')}
            className={`flex-1 p-3 rounded-lg text-yellow-400 font-semibold transition-transform transform hover:scale-105 focus:outline-none ${
              activeTab === 'drinks' ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'
            }`}
          >
            Drinks
          </button>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-blue-500">Add New Supply</h3>

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
          <label className="block text-sm font-medium mb-2 text-green-400">Supply Name</label>
          <input
            type="text"
            value={supplyName}
            onChange={(e) => setSupplyName(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter supply name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-green-400">Amount (Ksh)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total cost"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-green-400">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter quantity in ${unit}`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-green-400">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unit (e.g., kg, g, liters, crate)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-green-400">Supply Date</label>
          <input
            type="date"
            value={supplyDate}
            onChange={(e) => setSupplyDate(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-500 text-blue-700 p-3 rounded-lg transition-transform transform hover:scale-105 focus:outline-none"
        >
          Add Supply
        </button>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Supply List</h3>

          {filteredSupplies.length === 0 ? (
            <p className="text-yellow-300">No supplies available.</p>
          ) : (
            <ul className="space-y-4">
              {filteredSupplies.map((supply) => (
                <li
                  key={supply.id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-md"
                >
                  <span className="text-green-300">
                    {supply.name} - {supply.quantity} {supply.unit} - Ksh {supply.amount} on{' '}
                    {new Date(supply.supply_date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(supply.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
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

export default Supplies;
