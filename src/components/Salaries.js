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
    // Fetch the initial list of salaries when the component mounts
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
      console.log('Validation failed:', { employeeName, hours, pay, damages, date });
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

      // Fetch updated salaries list
      const { data } = await axios.get('https://hotel-management-backend-j1uy.onrender.com/api/salaries');
      setSalariesList(data.salaries);

      // Clear form fields
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
      
      // Remove the deleted salary from the list
      setSalariesList(salariesList.filter(salary => salary.id !== id));
    } catch (error) {
      console.error('Error deleting salary:', error);
      setErrorMessage('An error occurred while deleting the salary.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 via-yellow-200 to-red-300">
      <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
        Daily Salaries
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-auto">
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Input fields */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Hours Worked</label>
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of hours"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Total Pay (Ksh)</label>
            <input
              type="number"
              value={totalPay}
              onChange={(e) => setTotalPay(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter total pay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Total Damages (Ksh)</label>
            <input
              type="number"
              value={totalDamages}
              onChange={(e) => setTotalDamages(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter total damages"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select date"
            />
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700">
              Final Total Pay (Ksh): {calculateFinalTotalPay(Number(totalPay), Number(totalDamages)).toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-lg hover:bg-gradient-to-l from-blue-600 to-indigo-700 transition-colors"
        >
          Add Salary
        </button>
      </div>

      {salariesList.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Salaries List</h3>
          <ul className="space-y-4">
            {salariesList.map((salary) => (
              <li
                key={salary.id}
                className="flex justify-between items-center bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg shadow-md"
              >
                <div>
                  <p className="text-lg font-bold">{salary.employee_name}</p>
                  <p className="text-sm">Hours Worked: {salary.hours_worked.toLocaleString()}</p>
                  <p className="text-sm">Total Pay: Ksh {salary.total_pay.toLocaleString()}</p>
                  <p className="text-sm">Total Damages: Ksh {salary.total_damages.toLocaleString()}</p>
                  <p className="text-sm">Date: {new Date(salary.date).toLocaleDateString()}</p>
                  <p className="text-sm font-bold">Final Total Pay: Ksh {salary.final_total_pay.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(salary.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
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


