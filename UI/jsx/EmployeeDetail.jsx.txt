import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Form the URL parameters, retrieve the employee ID

const EmployeeDetail = () => {
  // Using the useParams hook, retrieve the employee ID from the URL
  const { id } = useParams();

  // Local state for storing error messages and employee data
  const [employee, setEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch employee details if the ID changes or the component mounts
  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]); // When the ID changes, the effect is activated

  // A function that retrieves employee information from the GraphQL API
  const fetchEmployeeDetails = async () => {
    const query = `
            query GetEmployeeById($id: ID!) {
                employeeDetail(id: $id) {
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
      // To the GraphQL server, submit a POST request
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { id },
        }),
      });

      // Handle response
      const result = await response.json();
      if (result.data && result.data.employeeDetail) {
        setEmployee(result.data.employeeDetail); // Set employee information if it is found
      } else {
        setErrorMessage("Employee not found"); // if the employee data is not returned, set an error message
      }
    } catch (error) {
      setErrorMessage("Failed to load employee details"); // Set an error message if the fetch attempt fails
    }
  };

  // Display the relevant message if there is an error or loading condition
  if (errorMessage) {
    return (
      <div>
        <h2>View Single Employee Detail</h2>
        <p className="error">{errorMessage}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div>
        <h2>View Single Employee Detail</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // Render employee information
  return (
    <div className="employee-detail">
      <h2>View Single Employee Detail</h2>

      {/* Show Employee Name */}
      <h3>
        {employee.firstName} {employee.lastName}
      </h3>
      <table border="1">
        <tbody>
          <tr>
            <td>
              <strong>Title:</strong>
            </td>
            <td>{employee.title}</td>
          </tr>
          <tr>
            <td>
              <strong>Age:</strong>
            </td>
            <td>{employee.age}</td>
          </tr>
          <tr>
            <td>
              <strong>Date of Joining:</strong>
            </td>
            <td>{employee.dateOfJoining}</td>
          </tr>
          <tr>
            <td>
              <strong>Department:</strong>
            </td>
            <td>{employee.department}</td>
          </tr>
          <tr>
            <td>
              <strong>Employee Type:</strong>
            </td>
            <td>{employee.employeeType}</td>
          </tr>
          <tr>
            <td>
              <strong>Status:</strong>
            </td>
            <td>{employee.currentStatus ? "Active" : "Inactive"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
