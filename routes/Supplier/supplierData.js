const db = require("../../dbcon"); // Import the database connection module

// Function to fetch all suppliers
const getAllSuppliers = () => {
  const query = "SELECT * FROM `suppliers`"; // SQL query to select all suppliers
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err); // Reject the promise with an error if the query fails
      } else {
        resolve(data); // Resolve the promise with the query result
      }
    });
  });
};

// Function to fetch a single supplier by ID
const getSupplierById = (id) => {
  const query = "SELECT * FROM `suppliers` WHERE id = ?"; // SQL query to select a supplier by ID
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(err); // Reject the promise with an error if the query fails
      } else {
        resolve(data); // Resolve the promise with the query result
      }
    });
  });
};

// Function to create a new supplier
const createSupplier = (supplier) => {
  const { name, id, address, contact, email, phoneNumber } = supplier; // Extract supplier details from input
  const query =
    "INSERT INTO `suppliers` (name, id, address, contact, email, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)"; // SQL query to insert a new supplier
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [name, id, address, contact, email, phoneNumber], // Values to insert
      (err, result) => {
        if (err) {
          reject(err); // Reject the promise with an error if the query fails
        } else {
          resolve(result); // Resolve the promise with the result of the insert operation
        }
      }
    );
  });
};

// Function to update a supplier by ID
const updateSupplierById = (id, supplier) => {
  const { name, address, contact, email, phoneNumber } = supplier; // Extract supplier details from input
  const query =
    "UPDATE suppliers SET name = ?, address = ?, contact = ?, email = ?, phoneNumber = ? WHERE id = ?"; // SQL query to update a supplier by ID
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [name, address, contact, email, phoneNumber, id], // Values to update
      (err, result) => {
        if (err) {
          reject(err); // Reject the promise with an error if the query fails
        } else {
          resolve(result); // Resolve the promise with the result of the update operation
        }
      }
    );
  });
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplierById,
}; // Export the functions for use in other parts of the application
