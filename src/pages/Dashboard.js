import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const MyEditor = () => {
  const [content, setContent] = useState("");
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    fetchNamesFromDatabase();
  }, []);

  const fetchNamesFromDatabase = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employee_list");
      setNames(response.data);
    } catch (error) {
      console.error("Failed to fetch names from the database:", error);
    }
  };

  const handleContentChange = (newValue) => {
    setContent(newValue);
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  const handleSave = async () => {
    const tagRegex = /{{(.*?)}}/g;
    const matches = content.matchAll(tagRegex);
    const data = {};
    let updatedContent = content;
    const matchesArray = Array.from(matches);

    const fetchDataPromises = [];

    for (const match of matchesArray) {
      const variable = match[1];
      const promise = fetchDataForVariable(variable);
      fetchDataPromises.push(promise);
    }

    const fetchedData = await Promise.all(fetchDataPromises);

    for (let i = 0; i < matchesArray.length; i+= 1) {
      const match = matchesArray[i];
      const variable = match[1];
      const value = fetchedData[i];
      const regex = new RegExp(`{{${variable}}}`, "g");
      updatedContent = updatedContent.replace(regex, value);
      data[variable] = value;
    }

    setContent(updatedContent);

    try {
      const response = await axios.post("http://localhost:3001/generate_contract", {
        selected_employee: selectedName,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to generate contract:", error);
    }
  };

  const fetchDataForVariable = async (variable) => {
    try {
      const response = await axios.get("http://localhost:3001/employee_list");
      const employeeList = response.data;
      const selectedEmployee = employeeList.find((employee) => employee.employee_ID === selectedName);

      if (selectedEmployee) {
        switch (variable) {
          case "fullNameEng":
            return selectedEmployee.fullNameEng;
          case "currentAddress":
            return selectedEmployee.currentAddress;
          case "personal_id":
            return selectedEmployee.personal_id;
          case "Positon":
            return selectedEmployee.Positon;
          case "Contract_Consultant_Name":
            return selectedEmployee.Contract_Consultant_Name;
          case "Contract_Duration":
            return selectedEmployee.Contract_Duration;
          case "client":
            return selectedEmployee.client;
          case "Work_address":
            return selectedEmployee.Work_address;
          case "Salary":
            return selectedEmployee.Salary;
          case "Agreement_expiration_period":
            return selectedEmployee.Agreement_expiration_period;
          case "Leave_eligibility":
            return selectedEmployee.Leave_eligibility;
          default:
            return "";
        }
      } else {
        return "";
      }
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
      return "";
    }
  };

  return (
    <div>
      <div>
        <p htmlFor="name">ชื่อ:</p>
        <select id="name" value={selectedName} onChange={handleNameChange}>
          <option value="">เลือกชื่อ</option>
          {names.map((employee) => (
            <option key={employee.employee_ID} value={employee.employee_ID}>
              {employee.fullNameEng}
            </option>
          ))}
        </select>
      </div>
      <ReactQuill value={content} onChange={handleContentChange} />
      <button onClick={handleSave}>บันทึก</button>
    </div>
  );
};

export default MyEditor;
