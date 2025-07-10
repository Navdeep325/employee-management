require("dotenv").config({ path: "./server/env.env" });
const { MongoClient } = require("mongodb");

const DB_URL = process.env.DBURI;
let db;

// Connect with the MongoDB database
async function connectDb() {
  const client = new MongoClient(DB_URL);
  await client.connect();
  db = client.db();
  console.log("Database Started");
  await dbInitialInsert();
}

// add a new employee record
async function dbInitialInsert() {
  await db
    .collection("employees")
    .drop()
    .catch((err) => console.log("No existing collection to drop"));
  const initialEmployees = [
    {
      id: "1",
      firstName: "Demo",
      lastName: "Demo",
      age: 20,
      dateOfJoining: "2000-01-01",
      title: "Manager",
      department: "IT",
      employeeType: "FullTime",
      currentStatus: true,
    },
  ];
  await db.collection("employees").insertMany(initialEmployees);
}

// Retrieve all employees from the database
async function getEmployees() {
  return await db.collection("employees").find({}).toArray();
}
// Get a single employee by their ID
async function getEmployeeById(id) {
  const employee = await db.collection("employees").findOne({ id: id });
  if (!employee) {
    throw new Error("Employee not found");
  }
  return employee;
}
// Add a new employee to the database
async function addEmployeeToDB(employee) {
  const existingEmployee = await db.collection("employees").findOne({
    firstName: employee.firstName,
    lastName: employee.lastName,
    age: employee.age,
  });

  if (existingEmployee) {
    throw new Error("Employee already exists.");
  }

  const newEmployee = {
    id: String((await db.collection("employees").countDocuments()) + 1),
    ...employee,
    currentStatus: true,
  };

  await db.collection("employees").insertOne(newEmployee);
  return newEmployee;
}

// Delete an employee by their ID from the database
const deleteEmployeeFromDB = async (id) => {
  try {
    // Use the native MongoDB methods to remove an employee
    const result = await db.collection("employees").deleteOne({ id: id });

    if (result.deletedCount === 0) {
      throw new Error("Employee not found");
    }

    return { id, success: true }; // Return an object with the status of success
  } catch (error) {
    throw new Error("Error deleting employee: " + error.message);
  }
};
// Update the database with the employee id
const updateEmployeeInDB = async (id, employeeUpdates) => {
  try {
    // use the employee's id to find them
    const currentEmployee = await db
      .collection("employees")
      .findOne({ id: id });

    if (!currentEmployee) {
      throw new Error("Employee not found");
    }

    // set up the update fields only the title, department, and current status may be changed
    const updateFields = {};

    if (employeeUpdates.title !== undefined) {
      updateFields.title = employeeUpdates.title;
    }

    if (employeeUpdates.department !== undefined) {
      updateFields.department = employeeUpdates.department;
    }

    if (employeeUpdates.currentStatus !== undefined) {
      updateFields.currentStatus = employeeUpdates.currentStatus;
    }

    // Return early if there are no valid fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    // update the database employee document
    await db
      .collection("employees")
      .updateOne({ id: id }, { $set: updateFields });

    // Return the updated employee by merging the current employee with the fields that have been modified
    return { ...currentEmployee, ...updateFields };
  } catch (error) {
    throw new Error("Error updating employee: " + error.message);
  }
};

module.exports = {
  connectDb,
  getEmployees,
  addEmployeeToDB,
  deleteEmployeeFromDB,
  updateEmployeeInDB,
  getEmployeeById,
};
