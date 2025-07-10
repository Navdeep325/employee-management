import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class EmployeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployeeType: "", // The chosen employee Type should be stored
    };
  }

  // Manage changes to dropdown selections
  handleEmployeeTypeChange = (e) => {
    this.setState({ selectedEmployeeType: e.target.value });
  };

  // Employees can be filtered according to the chosen employee type
  getFilteredEmployees = () => {
    const { employees } = this.props;
    const { selectedEmployeeType } = this.state;

    if (!selectedEmployeeType) {
      return employees; // If no type is chosen, all employees will be returned
    }

    // Employees can be filtered by the selected type
    return employees.filter(
      (employee) => employee.employeeType === selectedEmployeeType
    );
  };

  render() {
    const filteredEmployees = this.getFilteredEmployees();

    return (
      <div>
        {/* Filter Dropdown for employee type */}
        <div>
          <label htmlFor="employeeType">Filter by Employee Type:</label>
          <select
            id="employeeType"
            value={this.state.selectedEmployeeType}
            onChange={this.handleEmployeeTypeChange}
          >
            <option value="">All Employees</option>
            <option value="FullTime">Full-Time</option>
            <option value="PartTime">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>

        {/* Employee Table */}
        <table border="1">
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date Of Joining</th>
              <th>Title</th>
              <th>Department</th>
              <th>Employee Type</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const dateOfJoining = new Date(employee.dateOfJoining);
              const adjustedDate = new Date(
                dateOfJoining.getTime() +
                  dateOfJoining.getTimezoneOffset() * 60000
              );

              return (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.age}</td>
                  <td>{adjustedDate.toLocaleDateString("en-CA")}</td>
                  <td>{employee.title}</td>
                  <td>{employee.department}</td>
                  <td>{employee.employeeType}</td>
                  <td>{employee.currentStatus ? "Working" : "Retired"}</td>
                  <td>
                    {/* View Details Link */}
                    <Link to={`/employee/${employee.id}`}>View Details</Link>
                    <span className="space-line">|</span>

                    {/* Edit Link */}
                    <Link to={`/edit/${employee.id}`}>Edit</Link>
                    <span className="space-line">|</span>

                    {/* Delete Link */}
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        this.props.deleteEmployee(employee.id); // Activate the deletion process
                      }}
                      className="delete-button"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
