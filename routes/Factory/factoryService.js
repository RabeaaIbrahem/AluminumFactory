
const express = require("express");
const factoryData = require("./factoryData"); // Import the factory data
const router = express.Router(); // Create a new router instance

// Route handler to get all factories
router.get("/factory", async (req, res) => {
  try {
    const data = await factoryData.getAllFactories(); // Fetch all factories using the service
    res.json(data); // Send the retrieved factories as a JSON response
  } catch (err) {
    console.log(err); // Log the error to the console
    res.json(err); // Send the error as a JSON response
  }
});

router.get("/getVAT", async (req, res) => {
  try {
    const vatData = await factoryData.getVATvalue(); 

    // בדוק אם יש תוצאה
    if (vatData.length > 0) {
      // החזר את ה-VAT מהשורה הראשונה
      res.json({ vat: vatData[0].vat }); 
    } else {
      res.json({ vat: 0 }); // החזר 0 אם לא נמצא VAT
    }
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while fetching VAT' }); 
  }
});

// Route handler to create a new factory
router.post("/createFactory", async (req, res) => {
  try {
    const result = await factoryData.createFactory(req.body); // Create a new factory using the service
    res.json("You have added successfully!"); // Send a success message as a JSON response
  } catch (err) {
    console.log(err); // Log the error to the console
    res.json(err); // Send the error as a JSON response
  }
});

// Route handler to delete a factory by its ID
router.delete("/factory/:id", async (req, res) => {
  try {
    const result = await factoryData.deleteFactoryById(req.params.id); // Delete the factory using the service
    res.json(result); // Send the result of the deletion as a JSON response
  } catch (err) {
    console.log(err); // Log the error to the console
    res.json("Error"); // Send an error message as a JSON response
  }
});

// Route handler to update an existing factory by its ID
router.put("/updateFactory/:id", async (req, res) => {
  try {
    const result = await factoryData.updateFactoryById(req.params.id, req.body); // Update the factory using the service
    res.json(result); // Send the result of the update as a JSON response
  } catch (err) {
    console.log(err); // Log the error to the console
    res.json("Error"); // Send an error message as a JSON response
  }
});

module.exports = router; // Export the router to be used in the application
