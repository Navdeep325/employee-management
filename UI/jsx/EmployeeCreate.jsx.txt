import React from "react";
export default class EmployeeCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      dateOfJoining: "",
      title: "",
      department: "",
      employeeType: "",
      formErrors: {},
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, formErrors: {} });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      age,
      dateOfJoining,
      title,
      department,
      employeeType,
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
      this.setState({ formErrors: errors });
      return;
    }

    this.props.addEmployee(this.state);
    this.setState({
      firstName: "",
      lastName: "",
      age: "",
      dateOfJoining: "",
      title: "",
      department: "",
      employeeType: "",
      formErrors: {}, // resolve errors after submission
    });
  };

  render() {
    const { formErrors } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Add Employee</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={this.state.firstName}
          onChange={this.handleChange}
        />
        {formErrors.firstName && (
          <div className="error">{formErrors.firstName}</div>
        )}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={this.handleChange}
        />
        {formErrors.lastName && (
          <div className="error">{formErrors.lastName}</div>
        )}

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={this.state.age}
          onChange={this.handleChange}
          min="20"
          max="70"
        />
        {formErrors.age && <div className="error">{formErrors.age}</div>}

        <input
          type="date"
          name="dateOfJoining"
          value={this.state.dateOfJoining}
          onChange={this.handleChange}
        />
        {formErrors.dateOfJoining && (
          <div className="error">{formErrors.dateOfJoining}</div>
        )}

        <select
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        >
          <option value="">Select Title</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
        </select>
        {formErrors.title && <div className="error">{formErrors.title}</div>}

        <select
          name="department"
          value={this.state.department}
          onChange={this.handleChange}
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
        </select>
        {formErrors.department && (
          <div className="error">{formErrors.department}</div>
        )}

        <select
          name="employeeType"
          value={this.state.employeeType}
          onChange={this.handleChange}
        >
          <option value="">Select Employee Type</option>
          <option value="FullTime">FullTime</option>
          <option value="PartTime">PartTime</option>
          <option value="Contract">Contract</option>
          <option value="Seasonal">Seasonal</option>
        </select>
        {formErrors.employeeType && (
          <div className="error">{formErrors.employeeType}</div>
        )}

        <button type="submit">Add Employee</button>
      </form>
    );
  }
}
