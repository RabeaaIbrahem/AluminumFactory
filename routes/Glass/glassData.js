const db = require("../../dbcon"); // Import the database connection module

// Function to get all glass info
const getAllGlass = () => {
  const query = "SELECT * FROM `glass`"; // SQL query to select all records from the glass table
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the retrieved data
      }
    });
  });
};

// Function to get glass info by glassType
const getGlassById = (glassType) => {
  const query = "SELECT * FROM `glass` WHERE glassType = ?"; // SQL query to select records with a specific glassType
  return new Promise((resolve, reject) => {
    db.query(query, [glassType], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the retrieved data
      }
    });
  });
};

// Function to create or update a glass item
const createOrUpdateGlass = (glassType, Thickness, status) => {
  const query = `
    INSERT INTO glass (glassType, Thickness, status) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      Thickness = VALUES(Thickness), 
      status = VALUES(status)
  `; // SQL query to insert a new glass item or update it if it already exists
  return new Promise((resolve, reject) => {
    db.query(query, [glassType, Thickness, status], (err, result) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(result); // Resolve the promise with the result of the operation
      }
    });
  });
};

// Function to delete a specific glass item by type
const deleteGlassByType = (glassType) => {
  const query = "DELETE FROM `glass` WHERE glassType = ?"; // SQL query to delete records with a specific glassType
  return new Promise((resolve, reject) => {
    db.query(query, [glassType], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the result of the deletion
      }
    });
  });
};

// Function to update details of a specific glass item
const updateGlassByType = (glassType, Thickness, status) => {
  const query =
    "UPDATE `glass` SET `Thickness` = ?, `status` = ? WHERE glassType = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Thickness, status, glassType], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the result of the update
      }
    });
  });
};

module.exports = {
  getAllGlass,
  createOrUpdateGlass,
  deleteGlassByType,
  updateGlassByType,
  getGlassById,
}; // Export the functions for use in other modules
