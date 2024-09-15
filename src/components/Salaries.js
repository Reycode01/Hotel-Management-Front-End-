import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Salaries = () => {
  const [salariesList, setSalariesList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const { data } = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/salaries');
        setSalariesList(data.salaries);
      } catch (error) {
        console.error('Error fetching salaries:', error);
        setErrorMessage('Unable to fetch salaries.');
      }
    };

    fetchSalaries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-management-backend-j1uy.onrender.com/api/salaries/${id}`);
      setSuccessMessage('Salary record deleted successfully!');
      setSalariesList(salariesList.filter(salary => salary.id !== id));
    } catch (error) {
      console.error('Error deleting salary:', error);
      setErrorMessage('An error occurred while deleting the salary.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 py-4 px-4">
      <div className="p-5 bg-gray-800 bg-opacity-90 rounded-xl shadow-lg w-full border border-gray-700 backdrop-blur-md">
        <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 mb-8">
          Daily Salaries
        </h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-4 animate-bounce shadow-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 animate-shake shadow-md">
            {errorMessage}
          </div>
        )}

        {salariesList.length > 0 && (
          <div className="mt-12 p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg w-full border border-gray-700 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-6 text-teal-300">Salaries List</h3>
            <ul className="space-y-3">
              {salariesList.map((salary) => (
                <li
                  key={salary.id}
                  className="flex justify-between items-center bg-gradient-to-r from-teal-500 to-purple-500 text-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all"
                >
                  <div className="flex flex-row flex-wrap gap-4">
                    <span className="font-bold">{salary.employee_name}</span>
                    <span>Hours Worked: {salary.hours_worked.toLocaleString()}</span>
                    <span>Total Pay: Ksh {salary.total_pay.toLocaleString()}</span>
                    <span>Total Damages: Ksh {salary.total_damages.toLocaleString()}</span>
                    <span>Date: {new Date(salary.date).toLocaleDateString()}</span>
                    <span className="font-bold">Final Total Pay: Ksh {salary.final_total_pay.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(salary.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salaries;






