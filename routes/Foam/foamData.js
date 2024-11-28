const db = require("../../dbcon"); // Database connection

// Function to fetch all foams
const getAllFoams = () => {
  const query = "SELECT * FROM foam";
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Function to create or update a foam
const createOrUpdateFoam = (foamId, foamType, status) => {
  const query = `
    INSERT INTO foam (foamId, foamType, status) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      foamType = VALUES(foamType), 
      status = VALUES(status)
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [foamId, foamType, status], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to delete a foam by ID
const deleteFoamById = (foamId) => {
  const query = "DELETE FROM foam WHERE foamId = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [foamId], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Function to update a foam by ID
const updateFoamById = (foamId, foamType, status) => {
  const query = "UPDATE foam SET foamType = ?, status = ? WHERE foamId = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [foamType, status, foamId], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  getAllFoams,
  createOrUpdateFoam,
  deleteFoamById,
  updateFoamById,
};
