const path = require("path"); // Path module for handling and transforming file paths
const cors = require("cors"); // CORS middleware for handling Cross-Origin Resource Sharing
const express = require("express"); // Express framework for building web applications

const db = require("../../dbcon"); // Import the database connection module

const router = express.Router(); // Create a new router object for handling routes

// Route to search for profiles by ID
router.post("/profile", (req, res) => {
  const { searchTerm } = req.body; // Extract search term from request body

  // SQL query to search for profiles with IDs matching the search term
  const query = "SELECT * FROM profile WHERE id LIKE ?";

  // Execute the query with the search term parameter
  db.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error("Error executing query:", err); // Log any query execution errors
      res.status(500).send(err); // Send a 500 error response with the error details
      return;
    }
    res.json(results); // Send the query results as JSON response
  });
});

module.exports = router; // Export the router to use in other parts of the application
