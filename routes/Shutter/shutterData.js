const db = require("../../dbcon"); // Import the database connection module

// Function to fetch all shutters
const getAllShutters = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM shutters"; // Query to select all shutters
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching shutters:", err.message); // Log error message if query fails
        return reject(err); // Reject the promise with the error
      }
      resolve(data); // Resolve the promise with the query results
    });
  });
};

// Function to create a new shutter
const createShutter = (shutter) => {
  return new Promise((resolve, reject) => {
    const { shutterType } = shutter; // Extract shutterType from the input
    const status = 1; // Set status to 1 (active) for new entries
    const q = `
      INSERT INTO shutters (shutterType, status) 
      VALUES (?, ?)
    `; // Query to insert a new shutter into the database
    db.query(q, [shutterType, status], (err, result) => {
      if (err) {
        console.error("Error inserting shutter:", err.message); // Log error message if query fails
        return reject(err); // Reject the promise with the error
      }

      // Query to fetch the newly created shutter
      const newShutterQuery = "SELECT * FROM shutters WHERE shutterId = ?";
      db.query(newShutterQuery, [result.insertId], (err, newShutterData) => {
        if (err) {
          console.error("Error fetching new shutter:", err.message); // Log error message if query fails
          return reject(err); // Reject the promise with the error
        }
        resolve(newShutterData[0]); // Resolve the promise with the newly created shutter data
      });
    });
  });
};

// Function to update an existing shutter by shutterId
const updateShutterById = (shutterId, shutter) => {
  return new Promise((resolve, reject) => {
    const { shutterType, status } = shutter; // Extract shutterType and status from the input
    const q = `
      UPDATE shutters SET shutterType = ?, status = ? WHERE shutterId = ?
    `; // Query to update the shutter in the database
    db.query(q, [shutterType, status, shutterId], (err, result) => {
      if (err) {
        console.error("Error updating shutter:", err.message); // Log error message if query fails
        return reject(err); // Reject the promise with the error
      }
      resolve(result); // Resolve the promise with the result of the update operation
    });
  });
};
// Function to get a shutter by its ID
const getShutterById = (shutterId) => {
  const query = "SELECT * FROM shutters WHERE shutterId = ?"; // Query to select a shutter by ID
  return new Promise((resolve, reject) => {
    db.query(query, [shutterId], (err, data) => {
      if (err) {
        reject(err); // Reject the promise with the error if query fails
      } else {
        resolve(data[0]); // Resolve the promise with the first result of the query
      }
    });
  });
};

module.exports = {
  getAllShutters,
  createShutter,
  updateShutterById,
  getShutterById,
}; // Export the functions for use in other parts of the application
