const path = require("path"); // Path module for handling and transforming file paths
const cors = require("cors"); // CORS middleware for handling Cross-Origin Resource Sharing
const express = require("express"); // Express framework for building web applications

const db = require("../../dbcon"); // Import the database connection module

const router = express.Router(); // Create a new router object for handling routes

// Route to search for shutters by shutterId
router.post("/shutters", (req, res) => {
  const { searchTerm } = req.body; // Extract the search term from the request body

  // SQL query to search for shutters where shutterId matches the search term
  const query = "SELECT * FROM shutters WHERE shutterId LIKE ?";

  // Execute the query with the search term parameter
  db.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error("Error executing query:", err); // Log any errors that occur during query execution
      res.status(500).send(err); // Send a 500 Internal Server Error response with the error details
      return;
    }
    res.json(results); // Send the query results as a JSON response
  });
});

module.exports = router; // Export the router for use in other parts of the application
