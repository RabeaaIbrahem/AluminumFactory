const db = require("../../dbcon"); // Import the database connection. Adjust the path as necessary.

// Function to fetch all profiles
const getAllProfiles = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM profile"; // SQL query to select all profiles
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching profiles:", err.message); // Log any error
        return reject(err); // Reject the promise if there's an error
      }
      resolve(data); // Resolve the promise with the fetched data
    });
  });
};

// Function to create or update a profile
const createProfile = (profile) => {
  return new Promise((resolve, reject) => {
    const { id, perimeter, weight ,price,priceShutters} = profile;
    const status = 1; // Set status to 1 (active) for new entries
    const q = `
      INSERT INTO profile (id, perimeter, weight, price, priceShutters, status) 
      VALUES (?, ?, ?, ?,? ,?)
      ON DUPLICATE KEY UPDATE 
        perimeter = VALUES(perimeter), 
        weight = VALUES(weight),
        status = VALUES(status),
        priceShutters = VALUES(priceShutters),
        price = VALUES(price)
    `; // SQL query to insert or update a profile
    db.query(q, [id, perimeter, weight, price, priceShutters, status], (err, result) => {
      if (err) {
        console.error("Error inserting/updating profile:", err.message); // Log any error
        return reject(err); // Reject the promise if there's an error
      }

      // Fetch the newly created or updated profile
      const newProfileQuery = "SELECT * FROM profile WHERE id = ?"; // Query to fetch the profile by ID
      db.query(newProfileQuery, [id], (err, newProfileData) => {
        if (err) {
          console.error("Error fetching new profile:", err.message); // Log any error
          return reject(err); // Reject the promise if there's an error
        }
        resolve(newProfileData[0]); // Resolve the promise with the fetched profile
      });
    });
  });
};

// Function to delete a profile by ID
const deleteProfileById = (id) => {
  return new Promise((resolve, reject) => {
    const q = "DELETE FROM profile WHERE id = ?"; // SQL query to delete a profile by ID
    db.query(q, [id], (err, result) => {
      if (err) {
        console.error("Error deleting profile:", err.message); // Log any error
        return reject(err); // Reject the promise if there's an error
      }
      resolve(result); // Resolve the promise with the result of the delete operation
    });
  });
};

// Function to update a profile by ID
const updateProfileById = (id, profile) => {
  return new Promise((resolve, reject) => {
    const { perimeter, weight, price, priceShutters } = profile;
    const q = "UPDATE profile SET perimeter = ?, weight = ?, price = ?, priceShutters = ? WHERE id = ?"; // SQL query to update a profile by ID
    db.query(q, [perimeter, weight, price, priceShutters, id], (err, result) => {
      if (err) {
        console.error("Error updating profile:", err.message); // Log any error
        return reject(err); // Reject the promise if there's an error
      }
      resolve(result); // Resolve the promise with the result of the update operation
    });
  });
};

// Function to fetch a profile by ID
const getProfileById = (id) => {
  const query = "SELECT * FROM profile WHERE id = ?"; // SQL query to select a profile by ID
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the fetched data
      }
    });
  });
};

module.exports = {
  getAllProfiles,
  createProfile,
  deleteProfileById,
  updateProfileById,
  getProfileById,
};
