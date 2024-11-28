const express = require("express");
const router = express.Router();
const windowController = require("./windowData"); // Importing functions for window operations

// Route to get all windows
router.get("/windows", async (req, res) => {
  try {
    // Fetch all windows using the getAllWindows function
    const windows = await windowController.getAllWindows();
    res.status(200).json(windows); // Respond with the list of windows
  } catch (error) {
    console.error("Error fetching windows:", error.message); // Log the error
    res.status(500).json({ error: error.message }); // Respond with an error message
  }
});

// Route to get a window by ID
router.get("/windows/:idWindow", async (req, res) => {
  const { idWindow } = req.params; // Extract the window ID from URL parameters
  try {
    // Fetch the window by ID using the getWindowById function
    const window = await windowController.getWindowById(idWindow);
    if (window) {
      res.status(200).json(window); // Respond with the window data
    } else {
      res.status(404).json({ message: "Window not found" }); // Respond with a 404 status if window is not found
    }
  } catch (error) {
    console.error("Error fetching window by ID:", error.message); // Log the error
    res.status(500).json({ error: error.message }); // Respond with an error message
  }
});

// Route to create a new window
router.post("/windows", async (req, res) => {
  try {
    // Create a new window using the createWindow function
    const newWindow = await windowController.createWindow(req.body);
    res.status(201).json(newWindow); // Respond with the created window data
  } catch (error) {
    console.error("Error creating window:", error.message); // Log the error
    res.status(500).json({ error: error.message }); // Respond with an error message
  }
});

// Route to update a window by ID
router.put("/windows/:idWindow", async (req, res) => {
  const windowId = req.params.idWindow; // Extract the window ID from URL parameters
  const window = req.body; // Extract updated window data from request body
  try {
    // Update the window by ID using the updateWindowById function
    await windowController.updateWindowById(windowId, window);
    res.status(200).send("Window updated successfully"); // Respond with a success message
  } catch (err) {
    console.error("Error updating window:", err.message); // Log the error
    res.status(500).send("Error updating window"); // Respond with an error message
  }
});

// Route to delete a window by ID
router.delete("/windows/:idWindow", async (req, res) => {
  const { idWindow } = req.params; // Extract the window ID from URL parameters
  try {
    // Delete the window by ID using the deleteWindowById function
    await windowController.deleteWindowById(idWindow);
    res.status(200).json({ message: "Window deleted successfully" }); // Respond with a success message
  } catch (error) {
    console.error("Error deleting window:", error.message); // Log the error
    res.status(500).json({ error: error.message }); // Respond with an error message
  }
});

module.exports = router; // Export the router for use in the main application
