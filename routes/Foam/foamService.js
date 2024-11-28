const express = require("express");
const foamData = require("./foamData"); // Importing the database interaction functions
const router = express.Router();

// Route to fetch all foams
router.get("/foam", async (req, res) => {
  try {
    const data = await foamData.getAllFoams(); // Fetch all foam data
    return res.json(data); // Respond with the retrieved data
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({ error: "Internal Server Error" }); // Respond with a server error status
  }
});

// Route to create or update a foam
router.post("/createFoam", async (req, res) => {
  const { foamId, foamType } = req.body; // Extract foamId and foamType from the request body
  const status = 1; // Default status for foam

  try {
    await foamData.createOrUpdateFoam(foamId, foamType, status); // Create or update the foam in the database
    return res.status(201).json({
      message: "Foam added or updated successfully!", // Success message
      data: { foamId, foamType, status }, // Echo back the foam data
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({ error: "Internal Server Error" }); // Respond with a server error status
  }
});

// Route to delete a foam by ID
router.delete("/foam/:foamId", async (req, res) => {
  const { foamId } = req.params; // Extract foamId from the URL parameters

  try {
    await foamData.deleteFoamById(foamId); // Delete the foam from the database by its ID
    return res.json({ message: "Foam deleted successfully!" }); // Success message
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({ error: "Internal Server Error" }); // Respond with a server error status
  }
});

// Route to update a foam by ID
router.put("/updateFoam/:foamId", async (req, res) => {
  const { foamId } = req.params; // Extract foamId from the URL parameters
  const { foamType, status } = req.body; // Extract foamType and status from the request body

  // Check if foamType is provided
  if (!foamType) {
    return res.status(400).json({ error: "Missing foamType" }); // Respond with a bad request status if foamType is missing
  }

  try {
    await foamData.updateFoamById(foamId, foamType, status); // Update the foam in the database
    return res.json({ message: "Foam updated successfully!" }); // Success message
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({ error: "Internal Server Error" }); // Respond with a server error status
  }
});

module.exports = router; // Export the router
