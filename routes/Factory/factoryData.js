const db = require("../../dbcon"); // Import the database connection

// Function to retrieve all factories from the database
const getAllFactories = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM factory"; // SQL query to select all factories
    db.query(q, (err, data) => {
      if (err) {
        reject(err); // If an error occurs during the query, reject the promise
      } else {
        resolve(data); // If successful, resolve the promise with the retrieved data
      }
    });
  });
};

const getVATvalue = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT vat FROM factory LIMIT 1"; // הוסף LIMIT כדי להבטיח שורה אחת בלבד
    db.query(q, (err, data) => {
      if (err) {
        reject(err); 
      } else {
        resolve(data); 
      }
    });
  });
};


// Function to create a new factory in the database
const createFactory = (factory) => {
  return new Promise((resolve, reject) => {
    const { factoryName, address, id, contact, phoneNumber, email, vat } = factory; // Destructure the factory object
    const q = "INSERT INTO factory (factoryName, address, id, contact, phoneNumber, email, vat) VALUES (?, ?, ?, ?, ?, ?, ?)"; // SQL query to insert a new factory
    db.query(q, [factoryName, address, id, contact, phoneNumber, email, vat], (err, result) => {
      if (err) {
        reject(err); // If an error occurs during the query, reject the promise
      } else {
        resolve(result); // If successful, resolve the promise with the result of the query
      }
    });
  });
};

// Function to delete a factory by its ID from the database
const deleteFactoryById = (id) => {
  return new Promise((resolve, reject) => {
    const q = "DELETE FROM factory WHERE id = ?"; // SQL query to delete a factory by ID
    db.query(q, [id], (err, result) => {
      if (err) {
        reject(err); // If an error occurs during the query, reject the promise
      } else {
        resolve(result); // If successful, resolve the promise with the result of the query
      }
    });
  });
};

// Function to update an existing factory by its ID in the database
const updateFactoryById = (id, factory) => {
  return new Promise((resolve, reject) => {
    const { factoryName, address, contact, phoneNumber, email, vat } = factory; // Destructure the factory object
    const q = "UPDATE factory SET factoryName = ?, address = ?, contact = ?, phoneNumber = ?, email = ?, vat = ? WHERE id = ?"; // SQL query to update a factory by ID
    db.query(q, [factoryName, address, contact, phoneNumber, email, vat, id], (err, result) => {
      if (err) {
        reject(err); // If an error occurs during the query, reject the promise
      } else {
        resolve(result); // If successful, resolve the promise with the result of the query
      }
    });
  });
};

// Export the functions to be used in other modules
module.exports = {
  getAllFactories,
  createFactory,
  deleteFactoryById,
  updateFactoryById,
  getVATvalue
};