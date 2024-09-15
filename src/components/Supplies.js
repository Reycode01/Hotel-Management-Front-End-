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
  const [suppliesList, setSuppliesList] = useState([]);

  // Fetch supplies on component mount
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/supplies');
        setSuppliesList(response.data.supplies);
      } catch (error) {
        console.error('Error fetching supplies:', error);
      }
    };

    fetchSupplies();
  }, []);

  const handleSubmit = async () => {
    try {
      const formattedAmount = parseFloat(amount);
      const formattedQuantity = parseFloat(quantity);

      // Validate fields
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

      // Add supply and get the new supply's ID
      const response = await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/supplies', newSupply);
      
      // Add the new supply to the list
      setSuppliesList([...suppliesList, { ...newSupply, id: response.data.id }]);
      
      setSuccessMessage('Supply added successfully!');
      setSupplyName('');
      setAmount('');
      setQuantity('');
      setUnit('');
      setSupplyDate('');
    } catch (error) {
      console.error('Error adding supply:', error);
      setErrorMessage('An error occurred while adding the supply.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/supplies/${id}`);
      setSuppliesList(suppliesList.filter(supply => supply.id !== id));
    } catch (error) {
      console.error('Error deleting supply:', error);
      setErrorMessage('An error occurred while deleting the supply.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Daily Supplies</h2>
      
      {/* Success and Error Messages */}
      {successMessage && <div className="bg-green-100 p-4">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 p-4">{errorMessage}</div>}
      
      {/* Form for Adding Supplies */}
      <div>
        {/* Supply Form */}
        {/* Form inputs for supplyName, amount, quantity, unit, supplyDate */}
        <button onClick={handleSubmit}>Add Supply</button>
      </div>

      {/* List of Supplies */}
      <h3>Supplies List</h3>
      <ul>
        {suppliesList.map(supply => (
          <li key={supply.id}>
            {supply.name} - {supply.quantity} {supply.unit} - Ksh {supply.amount} - {supply.supplyDate}
            <button onClick={() => handleDelete(supply.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Supplies;

