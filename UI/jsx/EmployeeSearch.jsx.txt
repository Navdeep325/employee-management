import React from "react";
export default class EmployeeSearch extends React.Component {
  handleInputChange = (e) => {
    this.props.onSearch(e.target.value); // Use props to invoke the search handler
  };

  render() {
    return (
      <div>
        <h2>Search Employee</h2>
        <input
          type="text"
          placeholder="Search..."
          onChange={this.handleInputChange} // Modify the search query
        />
        <input type="submit" value="Search" />
      </div>
    );
  }
}
