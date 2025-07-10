import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
  const { id } = useParams(); // From the URL, retrieve the employee ID using useParams
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: false,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  // Retrieve employee data whenever id changes or the component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setErrorMessage(null); // Remove any prior error messages from the new request
      const query = `
        query {
          employeeList {
            id
            firstName
            lastName
            age
            dateOfJoining
            title
            department
            employeeType
            currentStatus
          }
        }
      `;
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        const emp = result.data.employeeList.find((emp) => emp.id === id);
        if (emp) {
          setEmployee(emp);
        } else {
          setErrorMessage("Employee not found.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchEmployeeData();
  }, [id]); // Every time id changes, when navigating to a different employee
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee({
      ...employee,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, department, currentStatus } = employee;

    const query = `
      mutation {
        updateEmployee(id: "${id}", employee: {
          title: "${title}",
          department: "${department}",
          currentStatus: ${currentStatus}
        }) {
          id
          title
          department
          currentStatus
        }
      }
    `;

    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.errors) {
        setErrorMessage(result.errors[0].message);
      } else {
        navigate("/"); // Go to the employee list or home page
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Date of Joining:</label>
          <input
            type="date"
            name="dateOfJoining"
            value={employee.dateOfJoining}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Title:</label>
          <select name="title" value={employee.title} onChange={handleChange}>
            <option value="">Select Title</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>
        <div>
          <label>Department:</label>
          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
        <div>
          <label>Employee Type:</label>
          <input
            type="text"
            name="employeeType"
            value={employee.employeeType}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>Current Status:</label>
          <input
            type="checkbox"
            name="currentStatus"
            checked={employee.currentStatus}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EmployeeEdit;
