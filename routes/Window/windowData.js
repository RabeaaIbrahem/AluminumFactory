const db = require("../../dbcon"); // Import the database connection module

// Function to fetch all windows
const getAllWindows = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM window"; // SQL query to select all records from the window table
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching windows:", err.message); // Log any errors encountered
        return reject(err); // Reject the promise with the error
      }
      resolve(data); // Resolve the promise with the fetched data
    });
  });
};

// Function to check if a windowType already exists
const checkWindowExists = (windowType) => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM window WHERE windowType = ?"; // SQL query to check if a windowType exists
    db.query(q, [windowType], (err, data) => {
      if (err) {
        console.error("Error checking window existence:", err.message); // Log any errors encountered
        return reject(err); // Reject the promise with the error
      }
      resolve(data.length > 0); // Resolve the promise with true if windowType exists, otherwise false
    });
  });
};

// Function to create a new window
const createWindow = async (window) => {
  const { windowType } = window;

  // Check if the windowType already exists
  const exists = await checkWindowExists(windowType);
  if (exists) {
    throw new Error("Window type already exists"); // Throw an error if the windowType already exists
  }

  return new Promise((resolve, reject) => {
    const q = `
      INSERT INTO window (windowType) 
      VALUES (?)
    `; // SQL query to insert a new window record
    db.query(q, [windowType], (err, result) => {
      if (err) {
        console.error("Error inserting window:", err.message); // Log any errors encountered
        return reject(err); // Reject the promise with the error
      }

      // Fetch the newly created window
      const newWindowQuery = "SELECT * FROM window WHERE idWindow = ?"; // SQL query to fetch the newly created window by its ID
      db.query(newWindowQuery, [result.insertId], (err, newWindowData) => {
        if (err) {
          console.error("Error fetching new window:", err.message); // Log any errors encountered
          return reject(err); // Reject the promise with the error
        }
        resolve(newWindowData[0]); // Resolve the promise with the newly created window data
      });
    });
  });
};

// Function to update an existing window by windowId
const updateWindowById = (idWindow, window) => {
  return new Promise((resolve, reject) => {
    const { windowType } = window;
    const q = `
      UPDATE window SET windowType = ? WHERE idWindow = ?
    `; // SQL query to update a window record
    db.query(q, [windowType, idWindow], (err, result) => {
      if (err) {
        console.error("Error updating window:", err.message); // Log any errors encountered
        return reject(err); // Reject the promise with the error
      }
      resolve(result); // Resolve the promise with the result of the update operation
    });
  });
};

// Function to delete a window by windowId
const deleteWindowById = (idWindow) => {
  return new Promise((resolve, reject) => {
    const q = "DELETE FROM window WHERE idWindow = ?"; // SQL query to delete a window record by its ID
    db.query(q, [idWindow], (err, result) => {
      if (err) {
        console.error("Error deleting window:", err.message); // Log any errors encountered
        return reject(err); // Reject the promise with the error
      }
      resolve(result); // Resolve the promise with the result of the delete operation
    });
  });
};

// Function to get a window by its ID
const getWindowById = (idWindow) => {
  const query = "SELECT * FROM window WHERE idWindow = ?"; // SQL query to select a window record by its ID
  return new Promise((resolve, reject) => {
    db.query(query, [idWindow], (err, data) => {
      if (err) {
        reject(err); // Reject the promise with the error
      } else {
        resolve(data[0]); // Resolve the promise with the fetched window data
      }
    });
  });
};

module.exports = {
  getAllWindows,
  createWindow,
  updateWindowById,
  deleteWindowById,
  getWindowById,
}; // Export the functions for use in other modules
