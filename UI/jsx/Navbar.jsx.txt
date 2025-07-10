import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import EmployeeCreate from "./EmployeeCreate.jsx";
import EmployeeEdit from "./EmployeeEdit.jsx";
import EmployeeDetail from "./EmployeeDetail.jsx";

const Navbar = ({ employees, deleteEmployee, addEmployee, handleSearch }) => {
  return (
    <div className="mainContainer">
      <div className="wrapper">
        {/* Navbar Links  */}
        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/" className="navbar-link">
                Employee List
              </NavLink>
            </li>
            <li>
              <NavLink to="/create" className="navbar-link">
                Add Employee
              </NavLink>
            </li>
            <li>
              <NavLink to="/edit/1" className="navbar-link">
                Edit Employee
              </NavLink>
            </li>
            <li>
              <NavLink to="/employee/1" className="navbar-link">
                View Single Employee
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <EmployeeSearch onSearch={handleSearch} />
                <EmployeeTable
                  employees={employees}
                  deleteEmployee={deleteEmployee}
                />
              </div>
            }
          />
          <Route
            path="/create"
            element={<EmployeeCreate addEmployee={addEmployee} />}
          />
          <Route path="/edit/:id" element={<EmployeeEdit />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default Navbar;
