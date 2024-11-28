const express = require("express");
const cors = require("cors");
const glassData = require("./glassData"); // Importing the database interaction functions

const router = express.Router();

// Middleware to enable CORS (Cross-Origin Resource Sharing)
router.use(cors());

// Route to get all glass info
router.get("/glass", async (req, res) => {
  try {
    const data = await glassData.getAllGlass(); // Fetch all glass data from the database
    return res.json(data); // Send the retrieved data as a JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" }); // Send a 500 error response if something goes wrong
  }
});

// Route to get glass info by glassType
router.get("/glass1/:glassType", async (req, res) => {
  const id = req.params.glassType; // Extract the glassType from the route parameters
  console.log(`Fetching glass with ID: ${id}`);

  try {
    const data = await glassData.getGlassById(id); // Fetch glass data by type from the database
    if (data.length === 0) {
      console.log(`Glass with ID ${id} not found`);
      return res.status(404).json({ error: "Glass not found" }); // Send a 404 response if no data is found
    }
    console.log(`Glass found: ${JSON.stringify(data[0])}`);
    return res.status(200).json(data[0]); // Send the retrieved glass data as a JSON response
  } catch (err) {
    console.error(`Database error: ${err.message}`); // Log the error message
    return res.status(500).json({ error: "Database error" }); // Send a 500 error response if something goes wrong
  }
});

// Route to create a new glass item
router.post("/create", async (req, res) => {
  let { glassType, Thickness } = req.body; // Extract glassType and Thickness from the request body
  Thickness = Number(Thickness); // Convert Thickness to a number

  const status = 1; // Default status value

  try {
    await glassData.createOrUpdateGlass(glassType, Thickness, status); // Create or update the glass item in the database
    return res.json({
      message: "Glass added or updated successfully!",
      data: { glassType, Thickness, status },
    }); // Send a success message with the glass data as a JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" }); // Send a 500 error response if something goes wrong
  }
});

// Route to delete a specific glass item by glassType
router.delete("/glass/:glassType", async (req, res) => {
  const { glassType } = req.params; // Extract the glassType from the route parameters

  try {
    await glassData.deleteGlassByType(glassType); // Delete the glass item from the database
    return res.json({ message: "Glass deleted successfully!" }); // Send a success message as a JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" }); // Send a 500 error response if something goes wrong
  }
});

// Route to update details of a specific glass item
router.put("/update/:glassType", async (req, res) => {
  const { Thickness, status } = req.body; // Extract Thickness and status from the request body
  const { glassType } = req.params; // Extract the glassType from the route parameters

  // Logging to verify incoming values
  console.log("Incoming glassType:", glassType);
  console.log("Incoming Thickness:", Thickness);
  console.log("Incoming status:", status);

  // Modify validation to allow `0` values
  if (Thickness == null || status == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await glassData.updateGlassByType(glassType, Thickness, status); // Update the glass item in the database
    return res.json({ message: "Glass updated successfully!" }); // Send a success message as a JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" }); // Send a 500 error response if something goes wrong
  }
});

module.exports = router; // Export the router to be used in other modules
