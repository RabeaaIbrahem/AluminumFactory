const db = require("../../dbcon"); // Import database connection

// Function to fetch all doors
const getAllDoors = () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM door"; // SQL query to select all doors
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching doors:", err.message); // Log error if occurs
        return reject(err); // Reject the promise if error
      }
      resolve(data); // Resolve with the fetched data
    });
  });
};

// Function to check if a doorType already exists
const checkDoorExists = (doorType) => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM door WHERE doorType = ?"; // SQL query to check existence
    db.query(q, [doorType], (err, data) => {
      if (err) {
        console.error("Error checking door existence:", err.message); // Log error if occurs
        return reject(err); // Reject the promise if error
      }
      resolve(data.length > 0); // Resolve with true if doorType exists, false otherwise
    });
  });
};

// Function to create a new door
const createDoor = async (door) => {
  const { doorType } = door;

  // Check if the doorType already exists
  const exists = await checkDoorExists(doorType);
  if (exists) {
    throw new Error("Door type already exists"); // Throw error if doorType exists
  }

  return new Promise((resolve, reject) => {
    const q = `
      INSERT INTO door (doorType) 
      VALUES (?)
    `; // SQL query to insert new door
    db.query(q, [doorType], (err, result) => {
      if (err) {
        console.error("Error inserting door:", err.message); // Log error if occurs
        return reject(err); // Reject the promise if error
      }

      // Fetch the newly created door
      const newDoorQuery = "SELECT * FROM door WHERE idDoor = ?"; // SQL query to fetch the new door
      db.query(newDoorQuery, [result.insertId], (err, newDoorData) => {
        if (err) {
          console.error("Error fetching new door:", err.message); // Log error if occurs
          return reject(err); // Reject the promise if error
        }
        resolve(newDoorData[0]); // Resolve with the newly created door data
      });
    });
  });
};

// Function to update an existing door by doorId
const updateDoorById = (idDoor, door) => {
  return new Promise((resolve, reject) => {
    const { doorType } = door;
    const q = `
      UPDATE door SET doorType = ? WHERE idDoor = ?
    `; // SQL query to update door by ID
    db.query(q, [doorType, idDoor], (err, result) => {
      if (err) {
        console.error("Error updating door:", err.message); // Log error if occurs
        return reject(err); // Reject the promise if error
      }
      resolve(result); // Resolve with the result of the update operation
    });
  });
};

// Function to delete a door by doorId
const deleteDoorById = (idDoor) => {
  return new Promise((resolve, reject) => {
    const q = "DELETE FROM door WHERE idDoor = ?"; // SQL query to delete door by ID
    db.query(q, [idDoor], (err, result) => {
      if (err) {
        console.error("Error deleting door:", err.message); // Log error if occurs
        return reject(err); // Reject the promise if error
      }
      resolve(result); // Resolve with the result of the delete operation
    });
  });
};

// Function to get a door by its ID
const getDoorById = (idDoor) => {
  const query = "SELECT * FROM door WHERE idDoor = ?"; // SQL query to select door by ID
  return new Promise((resolve, reject) => {
    db.query(query, [idDoor], (err, data) => {
      if (err) {
        reject(err); // Reject the promise if error
      } else {
        resolve(data[0]); // Resolve with the fetched door data
      }
    });
  });
};

module.exports = {
  getAllDoors,
  createDoor,
  updateDoorById,
  deleteDoorById,
  getDoorById,
};
