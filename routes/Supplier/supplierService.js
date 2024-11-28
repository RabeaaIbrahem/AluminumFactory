const express = require("express");
const supplierData = require("./supplierData"); // Importing database functions for supplier operations
const router = express.Router();

// Route to fetch all suppliers
router.get("/suppliers", async (req, res) => {
  try {
    // Fetch all suppliers using the getAllSuppliers function
    const data = await supplierData.getAllSuppliers();
    res.json(data); // Respond with the list of suppliers
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Database query error" }); // Respond with an error message
  }
});

// Route to fetch a single supplier by ID
router.get("/suppliers/:id", async (req, res) => {
  const id = req.params.id; // Extract the supplier ID from the URL parameters
  try {
    // Fetch the supplier by ID using the getSupplierById function
    const data = await supplierData.getSupplierById(id);
    if (data.length === 0) {
      // If no supplier is found, respond with a 404 status and an error message
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(data[0]); // Respond with the supplier data
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Database query error" }); // Respond with an error message
  }
});

// Route to create a new supplier
router.post("/createSupplier", async (req, res) => {
  const supplier = req.body; // Extract supplier data from the request body
  try {
    // Create a new supplier using the createSupplier function
    await supplierData.createSupplier(supplier);
    res.json({ message: "Supplier added successfully!" }); // Respond with a success message
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to create supplier" }); // Respond with an error message
  }
});

// Route to update a supplier by ID
router.put("/suppliers/:id", async (req, res) => {
  const id = req.params.id; // Extract the supplier ID from the URL parameters
  const supplier = req.body; // Extract updated supplier data from the request body
  try {
    // Update the supplier by ID using the updateSupplierById function
    const result = await supplierData.updateSupplierById(id, supplier);
    if (result.affectedRows === 0) {
      // If no rows were affected, respond with a 404 status and an error message
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ message: "Supplier updated successfully" }); // Respond with a success message
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to update supplier" }); // Respond with an error message
  }
});

module.exports = router; // Export the router for use in the main application
