const express = require("express");
const path = require("path");
const proxy = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(express.static("public"));

// Establish the target URL to which the proxy will send requests to GraphQL API
const apiProxyTarget = "http://localhost:8000/graphql";
// Cross-Origin Resource sharing(CORS) should be enabled, and requests from http://localhost:3000 should be permitted
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Create a proxy for GraphQL requests if apiProxyTarget is provided
if (apiProxyTarget) {
  app.use("/graphql", proxy({ target: apiProxyTarget }));
}
// Launch the Express server on port 3000
app.listen(3000, () => {
  console.log("App started on port 3000");
});
app.get("./", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});
