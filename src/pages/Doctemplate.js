import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Inject the required modules


const GenerateContract = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get('https://jingjo-backend-customer.vercel.app/employee_list');
      setEmployeeList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://jingjo-backend-customer.vercel.app/generate_contract', {
        selected_employee: selectedEmployee,
      });
      setMessage(response.data);
      const downloadLink = response.data;
      window.location.href = downloadLink;
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการสร้างสัญญา');
    }
  };


 

  return (
    <div>
      <h1>Generate Contract</h1>
      <form onSubmit={handleSubmit}>
        <p htmlFor="selected_employee">เลือกรายชื่อที่ต้องการแสดงข้อมูล:</p>
        <select
          id="selected_employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          required
        >
          <option value="">เลือก</option>
          {employeeList.map((employee, index) => (
            <option key={index} value={employee.employee_ID}>
              {employee.fullNameEng}
            </option>
          ))}
        </select>
        <button type="submit">สร้างสัญญา</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default GenerateContract;
