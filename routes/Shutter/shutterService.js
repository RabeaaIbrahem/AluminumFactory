const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router object for handling routes
const shutterController = require("./shutterData"); // Import the shutter controller for database operations

// Route to get all shutters
router.get("/shutters", async (req, res) => {
  try {
    const shutters = await shutterController.getAllShutters(); // Fetch all shutters from the controller
    res.status(200).json(shutters); // Send the shutters as a JSON response with a 200 status code
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors with a 500 Internal Server Error status and error message
  }
});

// Route to get a shutter by ID
router.get("/shutters/:shutterId", async (req, res) => {
  const { shutterId } = req.params; // Extract the shutter ID from request parameters
  try {
    const shutter = await shutterController.getShutterById(shutterId); // Fetch the specific shutter from the controller
    if (shutter) {
      res.status(200).json(shutter); // Send the shutter data as a JSON response with a 200 status code
    } else {
      res.status(404).json({ message: "Shutter not found" }); // Send a 404 Not Found response if the shutter does not exist
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors with a 500 Internal Server Error status and error message
  }
});

// Route to create a new shutter
router.post("/shutters", async (req, res) => {
  try {
    const newShutter = await shutterController.createShutter(req.body); // Create a new shutter using the controller
    res.status(201).json(newShutter); // Send the newly created shutter as a JSON response with a 201 Created status code
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors with a 500 Internal Server Error status and error message
  }
});

// Route to update a shutter by ID
router.put("/shutters/:id", async (req, res) => {
  const shutterId = req.params.id; // Extract the shutter ID from request parameters
  const shutter = req.body; // Extract the updated shutter data from the request body
  try {
    await shutterController.updateShutterById(shutterId, shutter); // Update the shutter using the controller
    res.status(200).send("Shutter updated successfully"); // Send a success message with a 200 status code
  } catch (err) {
    console.error("Error updating shutter:", err.message); // Log the error message for debugging
    res.status(500).send("Error updating shutter"); // Handle any errors with a 500 Internal Server Error status and a generic error message
  }
});
module.exports = router; // Export the router for use in other parts of the application
