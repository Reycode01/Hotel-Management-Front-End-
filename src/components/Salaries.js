import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Salaries = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [totalPay, setTotalPay] = useState('');
  const [totalDamages, setTotalDamages] = useState('');
  const [date, setDate] = useState('');
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

  const calculateFinalTotalPay = (pay, damages) => {
    return pay - damages;
  };

  const handleSubmit = async () => {
    const hours = Number(hoursWorked);
    const pay = Number(totalPay);
    const damages = Number(totalDamages);

    if (!employeeName.trim() || hours <= 0 || pay <= 0 || isNaN(hours) || isNaN(pay) || isNaN(damages) || !date) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    const calculatedFinalPay = calculateFinalTotalPay(pay, damages);
    const newSalary = {
      employeeName,
      hoursWorked: hours,
      totalPay: pay,
      totalDamages: damages,
      finalTotalPay: calculatedFinalPay,
      date,
    };

    try {
      await axios.post('https://hotel-management-backend-j1uy.onrender.com/api/salaries', newSalary);
      setSuccessMessage('Salary successfully added.');
      setErrorMessage('');

      const { data } = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/salaries');
      setSalariesList(data.salaries);

      setEmployeeName('');
      setHoursWorked('');
      setTotalPay('');
      setTotalDamages('');
      setDate('');
    } catch (error) {
      console.error('Error adding salary:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error || 'An error occurred.');
      } else {
        setErrorMessage('An error occurred while adding the salary.');
      }
      setSuccessMessage('');
    }
  };

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-300">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full px-4 py-2 border border-teal-500 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
              placeholder="Enter employee name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-300">Hours Worked</label>
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full px-4 py-2 border border-teal-500 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
              placeholder="Enter hours worked"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-300">Total Pay (Ksh)</label>
            <input
              type="number"
              value={totalPay}
              onChange={(e) => setTotalPay(e.target.value)}
              className="w-full px-4 py-2 border border-teal-500 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
              placeholder="Enter total pay"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-300">Total Damages (Ksh)</label>
            <input
              type="number"
              value={totalDamages}
              onChange={(e) => setTotalDamages(e.target.value)}
              className="w-full px-4 py-2 border border-teal-500 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
              placeholder="Enter total damages"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-teal-500 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
            />
          </div>
          <div className="flex items-center">
            <p className="text-lg font-semibold text-teal-400">
              Final Pay: Ksh {calculateFinalTotalPay(Number(totalPay), Number(totalDamages)).toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-teal-400 text-white py-3 rounded-lg shadow-lg hover:bg-gradient-to-l transform transition-all hover:scale-100"
        >
          Add Salary
        </button>
      </div>

      {salariesList.length > 0 && (
        <div className="mt-12 p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg w-full border border-gray-700 backdrop-blur-md">
          <h3 className="text-2xl font-semibold mb-6 text-teal-300">Salaries List</h3>
          <ul className="space-y-3">
            {salariesList.map((salary) => (
              <li
                key={salary.id}
                className="flex justify-between items-center bg-gradient-to-r from-teal-500 to-purple-500 text-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all"
              >
                <div>
                  <p className="text-xl font-bold">{salary.employee_name}, Hours Worked: {salary.hours_worked.toLocaleString()},Total Pay: Ksh {salary.total_pay.toLocaleString()}, Total Damages: Ksh {salary.total_damages.toLocaleString()},  Date: {new Date(salary.date).toLocaleDateString()}</p>
                  <p className="font-bold">Final Total Pay: Ksh {salary.final_total_pay.toLocaleString()}</p>
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
  );
};

export default Salaries;






