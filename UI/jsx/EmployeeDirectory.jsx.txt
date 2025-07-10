import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import Navbar from "./Navbar.jsx";

class EmployeeDirectory extends React.Component {
  constructor(props) {
    super(props);
    // set up the state with the search query, error MessageChannel, and employees
    this.state = {
      employees: [],
      errorMessage: null,
      searchQuery: "",
    };
  }

  componentDidMount() {
    this.loadData();
  }
//  A function that retrieves employee data from the GraphQL endpoint
  loadData = async () => {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query {
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
                }`,
      }),
    });
    const result = await response.json();
    // update the state using the employee's information
    this.setState({ employees: result.data.employeeList });
  };
  // A function that uses GraphQL mutation to add a new employee
  addEmployee = async (employee) => {
    const query = `
      mutation {
        addEmployee(employee: {
          firstName: "${employee.firstName}",
          lastName: "${employee.lastName}",
          age: ${employee.age},
          dateOfJoining: "${employee.dateOfJoining}",
          title: "${employee.title}",
          department: "${employee.department}",
          employeeType: "${employee.employeeType}"
        }) {
          id
        }
      }`;

    await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    this.loadData();
  };
  // GraphQL mutation function to delete an employee
  deleteEmployee = async (id) => {
    const query = `
      mutation {
        deleteEmployee(id: "${id}") {
          id
          success
        }
      }`;
    await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    this.loadData();
  };
  // Handle user input search query functionality
  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  render() {
    // use the search query to simplify the employee list
    const filteredEmployees = this.state.employees.filter(
      (employee) =>
        employee.firstName
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase()) ||
        employee.lastName
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase())
    );

    return (
      <Router>
        <div>
         <h1>Employee Management System</h1>
        <Navbar
          employees={filteredEmployees}
          deleteEmployee={this.deleteEmployee}
          addEmployee={this.addEmployee}
          handleSearch={this.handleSearch}
        />
        </div>
      </Router>
    );
  }
}

const element = <EmployeeDirectory />;
ReactDOM.render(element, document.getElementById("root"));
