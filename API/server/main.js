require("dotenv").config({ path: "./server/env.env" });
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
  connectDb,
  getEmployees,
  addEmployeeToDB,
  deleteEmployeeFromDB,
  updateEmployeeInDB,
  getEmployeeById,
} = require("./db");
const { gql } = require("apollo-server-express");

const fs = require("fs");
const path = require("path");

// GraphQL schema is dynamically loaded from the qlschema file
const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, "qlschema.txt"), "utf-8")
);

// create Graphql query and mutation resolvers
const resolvers = {
  Query: {
    employeeList: async () => {
      return await getEmployees();
    },
    employeeDetail: async (_, { id }) => {
      return await getEmployeeById(id); // use the new function to retrieve employees by ID
    },
  },
  Mutation: {
    addEmployee: async (_, { employee }) => {
      try {
        return await addEmployeeToDB(employee);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteEmployee: async (_, { id }) => {
      try {
        // Call the delete function from db.js
        const result = await deleteEmployeeFromDB(id);

        return {
          id: result.id,
          success: result.success,
        };
      } catch (error) {
        throw new Error(`Failed to delete employee: ${error.message}`);
      }
    },
    updateEmployee: async (_, { id, employee }) => {
      try {
        const updatedEmployee = await updateEmployeeInDB(id, employee);
        return updatedEmployee;
      } catch (error) {
        throw new Error(`Failed to update employee: ${error.message}`);
      }
    },
  },
};
const app = express();
// create an Apollo server instance with the defined type definitions and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// start the Apollo server and integrating it with the Express app
server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });

  // Connect with the MongoDB database
  connectDb()
    .then(() => {
      const port = process.env.SERVER_PORT || 3000;
      app.listen(port, () => {
        console.log(`App started on port ${port}`);
        console.log("API server has started");
      });
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    });
});
