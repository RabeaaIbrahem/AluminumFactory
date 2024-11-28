const db = require("../../dbcon"); // Database connection

// Function to fetch a customer by ID
const getCustomerById = (id) => {
  const query = "SELECT * FROM `customers` WHERE id = ?"; // SQL query to select a customer by ID
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the customer data
      }
    });
  });
};

// Function to fetch all customers
const getAllCustomers = () => {
  const query = "SELECT * FROM `customers`"; // SQL query to select all customers
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with all customer data
      }
    });
  });
};

// Function to create a new customer
const createCustomer = (customer) => {
  const { id, name, family, phoneNumber, email, address } = customer;
  const query = `
    INSERT INTO customers (id, name, family, phoneNumber, email, address) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      name = VALUES(name), 
      family = VALUES(family),
      phoneNumber = VALUES(phoneNumber),
      email = VALUES(email),
      address = VALUES(address)
  `; // SQL query to insert or update a customer
  return new Promise((resolve, reject) => {
    db.query(query, [id, name, family, phoneNumber, email, address], (err, result) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(result); // Resolve the promise with the result of the query
      }
    });
  });
};

// Function to update a customer by ID
const updateCustomerById = (id, customer) => {
  const { name, family, phoneNumber, email, address } = customer;
  const query = `
    UPDATE customers SET 
      name = ?, 
      family = ?, 
      phoneNumber = ?, 
      email = ?, 
      address = ? 
    WHERE id = ?
  `; // SQL query to update a customer by ID
  return new Promise((resolve, reject) => {
    db.query(query, [name, family, phoneNumber, email, address, id], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(data); // Resolve the promise with the result of the update
      }
    });
  });
};

module.exports = {
  getCustomerById,
  getAllCustomers,
  createCustomer,
  updateCustomerById,
};
