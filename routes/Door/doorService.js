const express = require("express");
const router = express.Router();
const doorController = require("./doorData"); // Importing database access functions for door data

// Route to get all doors
router.get("/doors", async (req, res) => {
  try {
    // Fetch all doors from the database
    const doors = await doorController.getAllDoors();
    res.status(200).json(doors); // Return the list of doors with status 200
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return 500 for server errors
  }
});

// Route to get a door by ID
router.get("/doors/:idDoor", async (req, res) => {
  const { idDoor } = req.params; // Retrieve the door ID from the URL parameters
  try {
    // Fetch the door by ID from the database
    const door = await doorController.getDoorById(idDoor);
    if (door) {
      res.status(200).json(door); // Return the door data with status 200 if found
    } else {
      res.status(404).json({ message: "Door not found" }); // Return 404 if door not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return 500 for server errors
  }
});

// Route to create a new door
router.post("/doors", async (req, res) => {
  try {
    // Create a new door in the database
    const newDoor = await doorController.createDoor(req.body);
    res.status(201).json(newDoor); // Return the created door with status 201
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return 500 for server errors
  }
});

// Route to update a door by ID
router.put("/doors/:idDoor", async (req, res) => {
  const idDoor = req.params.idDoor; // Retrieve the door ID from the URL parameters
  const door = req.body; // Retrieve the door data from the request body
  try {
    // Update the door by ID in the database
    await doorController.updateDoorById(idDoor, door);
    res.status(200).send("Door updated successfully"); // Return 200 if update was successful
  } catch (err) {
    console.error("Error updating door:", err.message); // Log error for debugging
    res.status(500).send("Error updating door"); // Return 500 for server errors
  }
});

// Route to delete a door by ID
router.delete("/doors/:idDoor", async (req, res) => {
  const { idDoor } = req.params; // Retrieve the door ID from the URL parameters
  try {
    // Delete the door by ID from the database
    await doorController.deleteDoorById(idDoor);
    res.status(200).json({ message: "Door deleted successfully" }); // Return 200 if deletion was successful
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return 500 for server errors
  }
});

module.exports = router; // Export the router to be used in the main app
