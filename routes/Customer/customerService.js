const express = require("express");
const customerData = require("./customerData"); // Importing database access functions
const router = express.Router();

// Route to fetch a customer by ID
router.get("/customer/:id", async (req, res) => {
  const id = req.params.id; // Retrieve the customer ID from the URL parameters
  console.log(`Fetching customer with ID: ${id}`);

  try {
    // Fetch customer data from the database
    const data = await customerData.getCustomerById(id);
    if (data.length === 0) {
      console.log(`Customer with ID ${id} not found`);
      return res.status(404).json({ error: "Customer not found" }); // Return 404 if customer is not found
    }
    console.log(`Customer found: ${JSON.stringify(data[0])}`);
    return res.status(200).json(data[0]); // Return customer data with status 200
  } catch (err) {
    console.error(`Database error: ${err.message}`);
    return res.status(500).json({ error: "Database error" }); // Return 500 for database errors
  }
});

// Route to fetch all customers
router.get("/customers", async (req, res) => {
  try {
    // Fetch all customer data from the database
    const data = await customerData.getAllCustomers();
    return res.status(200).json(data); // Return all customer data with status 200
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" }); // Return 500 for database errors
  }
});

// Route to create a new customer
router.post("/createCustomer", async (req, res) => {
  const { id, name, family, phoneNumber, email, address } = req.body;

  // Check if all required fields are provided
  if (!id || !name || !family || !phoneNumber || !email || !address) {
    return res.status(400).json({ error: "Missing required fields" }); // Return 400 if any field is missing
  }

  try {
    // Insert new customer into the database
    await customerData.createCustomer({ id, name, family, phoneNumber, email, address });
    return res.status(201).json({ message: "Customer added successfully!" }); // Return 201 for successful creation
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" }); // Return 500 for database errors
  }
});

// Route to update customer details by ID
router.put("/customer/:id", async (req, res) => {
  const { name, family, phoneNumber, email, address } = req.body;
  const id = req.params.id; // Retrieve the customer ID from the URL parameters

  // Check if all required fields are provided
  if (!name || !family || !phoneNumber || !email || !address) {
    return res.status(400).json({ error: "Missing required fields" }); // Return 400 if any field is missing
  }

  try {
    // Update customer details in the database
    const result = await customerData.updateCustomerById(id, { name, family, phoneNumber, email, address });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" }); // Return 404 if the customer does not exist
    }
    return res.status(200).json({ message: "Customer updated successfully!" }); // Return 200 for successful update
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" }); // Return 500 for database errors
  }
});

module.exports = router; // Export the router to be used in the main app
