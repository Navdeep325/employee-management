class EmployeeDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      errorMessage: null,
      searchQuery: ''
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = async () => {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: '{ employeeList { id firstName lastName age dateOfJoining title department employeeType currentStatus } }'
      })
    });
    const result = await response.json();
    this.setState({
      employees: result.data.employeeList
    });
  };
  addEmployee = async employee => {
    const query = `mutation {
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
    await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    this.loadData();
  };
  handleSearch = query => {
    this.setState({
      searchQuery: query
    });
  };
  render() {
    const filteredEmployees = this.state.employees.filter(employee => employee.firstName.toLowerCase().includes(this.state.searchQuery.toLowerCase()) || employee.lastName.toLowerCase().includes(this.state.searchQuery.toLowerCase()));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Employee Management System"), this.state.errorMessage && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, this.state.errorMessage), /*#__PURE__*/React.createElement(EmployeeSearch, {
      onSearch: this.handleSearch
    }), /*#__PURE__*/React.createElement(EmployeeTable, {
      employees: filteredEmployees
    }), /*#__PURE__*/React.createElement(EmployeeCreate, {
      addEmployee: this.addEmployee
    }));
  }
}
class EmployeeSearch extends React.Component {
  handleInputChange = e => {
    this.props.onSearch(e.target.value); // Call the search handler from props
  };
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Search Employee"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search...",
      onChange: this.handleInputChange // Update the search term
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Search"
    }));
  }
}
class EmployeeTable extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("table", {
      border: "1"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Id"), /*#__PURE__*/React.createElement("th", null, "First Name"), /*#__PURE__*/React.createElement("th", null, "Last Name"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Date Of Joining"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Employee Type"), /*#__PURE__*/React.createElement("th", null, "Current Status"))), /*#__PURE__*/React.createElement("tbody", null, this.props.employees.map(employee => {
      const dateOfJoining = new Date(employee.dateOfJoining);
      const adjustedDate = new Date(dateOfJoining.getTime() + dateOfJoining.getTimezoneOffset() * 60000);
      return /*#__PURE__*/React.createElement("tr", {
        key: employee.id
      }, /*#__PURE__*/React.createElement("td", null, employee.id), /*#__PURE__*/React.createElement("td", null, employee.firstName), /*#__PURE__*/React.createElement("td", null, employee.lastName), /*#__PURE__*/React.createElement("td", null, employee.age), /*#__PURE__*/React.createElement("td", null, adjustedDate.toLocaleDateString('en-CA')), /*#__PURE__*/React.createElement("td", null, employee.title), /*#__PURE__*/React.createElement("td", null, employee.department), /*#__PURE__*/React.createElement("td", null, employee.employeeType), /*#__PURE__*/React.createElement("td", null, employee.currentStatus ? 'Working' : 'Retired'));
    })));
  }
}
class EmployeeCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      age: '',
      dateOfJoining: '',
      title: '',
      department: '',
      employeeType: '',
      formErrors: {}
    };
  }
  handleChange = e => {
    const {
      name,
      value
    } = e.target;
    this.setState({
      [name]: value,
      formErrors: {}
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      age,
      dateOfJoining,
      title,
      department,
      employeeType
    } = this.state;
    const errors = {};

    // Validity checks
    if (!firstName) errors.firstName = "First Name is required.";
    if (!lastName) errors.lastName = "Last Name is required.";
    if (!age) errors.age = "Age is required.";
    if (!dateOfJoining) errors.dateOfJoining = "Date of Joining is required.";
    if (!title) errors.title = "Title is required.";
    if (!department) errors.department = "Department is required.";
    if (!employeeType) errors.employeeType = "Employee Type is required.";

    // set errors if there are any
    if (Object.keys(errors).length > 0) {
      this.setState({
        formErrors: errors
      });
      return;
    }
    this.props.addEmployee(this.state);
    this.setState({
      firstName: '',
      lastName: '',
      age: '',
      dateOfJoining: '',
      title: '',
      department: '',
      employeeType: '',
      formErrors: {} // resolve errors after submission
    });
  };
  render() {
    const {
      formErrors
    } = this.state;
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("h2", null, "Add Employee"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "firstName",
      placeholder: "First Name",
      value: this.state.firstName,
      onChange: this.handleChange
    }), formErrors.firstName && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.firstName), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "lastName",
      placeholder: "Last Name",
      value: this.state.lastName,
      onChange: this.handleChange
    }), formErrors.lastName && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.lastName), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "age",
      placeholder: "Age",
      value: this.state.age,
      onChange: this.handleChange,
      min: "20",
      max: "70"
    }), formErrors.age && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.age), /*#__PURE__*/React.createElement("input", {
      type: "date",
      name: "dateOfJoining",
      value: this.state.dateOfJoining,
      onChange: this.handleChange
    }), formErrors.dateOfJoining && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.dateOfJoining), /*#__PURE__*/React.createElement("select", {
      name: "title",
      value: this.state.title,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select Title"), /*#__PURE__*/React.createElement("option", {
      value: "Employee"
    }, "Employee"), /*#__PURE__*/React.createElement("option", {
      value: "Manager"
    }, "Manager"), /*#__PURE__*/React.createElement("option", {
      value: "Director"
    }, "Director"), /*#__PURE__*/React.createElement("option", {
      value: "VP"
    }, "VP")), formErrors.title && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.title), /*#__PURE__*/React.createElement("select", {
      name: "department",
      value: this.state.department,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select Department"), /*#__PURE__*/React.createElement("option", {
      value: "IT"
    }, "IT"), /*#__PURE__*/React.createElement("option", {
      value: "Marketing"
    }, "Marketing"), /*#__PURE__*/React.createElement("option", {
      value: "HR"
    }, "HR"), /*#__PURE__*/React.createElement("option", {
      value: "Engineering"
    }, "Engineering")), formErrors.department && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.department), /*#__PURE__*/React.createElement("select", {
      name: "employeeType",
      value: this.state.employeeType,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select Employee Type"), /*#__PURE__*/React.createElement("option", {
      value: "FullTime"
    }, "FullTime"), /*#__PURE__*/React.createElement("option", {
      value: "PartTime"
    }, "PartTime"), /*#__PURE__*/React.createElement("option", {
      value: "Contract"
    }, "Contract"), /*#__PURE__*/React.createElement("option", {
      value: "Seasonal"
    }, "Seasonal")), formErrors.employeeType && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, formErrors.employeeType), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add Employee"));
  }
}
const element = /*#__PURE__*/React.createElement(EmployeeDirectory, null);
ReactDOM.render(element, document.getElementById('root'));