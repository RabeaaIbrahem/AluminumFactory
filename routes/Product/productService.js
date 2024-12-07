const express = require("express"); // Import express for routing
const productData = require("./productData"); // Import the module for product data operations
const router = express.Router(); // Create a new router instance
const db = require("../../dbcon"); // Import the database connection

// Route to fetch all products
router.get("/product", async (req, res) => {
  try {
    const products = await productData.getAllProducts(); // Fetch all products using productData module
    res.json(products); // Send the products as JSON response
  } catch (err) {
    console.error("Failed to fetch products:", err.message); // Log any error
    res.status(500).json({ error: "Failed to fetch products" }); // Send error response
  }
});

// Route to fetch a product by ID
router.get("/product1/:idProduct", async (req, res) => {
  const { idProduct } = req.params; // Extract product ID from URL parameters
  try {
    const product = await productData.getProductById(idProduct); // Fetch the product by ID
    if (product) {
      res.json(product); // Send the product as JSON response
    } else {
      res.status(404).json({ error: "Product not found" }); // Product not found
    }
  } catch (err) {
    console.error("Error fetching product:", err.message); // Log any error
    res.status(500).json({ error: "Failed to fetch product" }); // Send error response
  }
});

// Route to create a new product
router.post("/createProduct", async (req, res) => {
  const {
    description,
    height,
    width,
    profileType,
    glassType,
    shutterType,
    pricePerUnit,
    quantity,
    idDoor,
    idWindow,
  } = req.body;
  try {
    const productId = await productData.createProduct({
      description,
      height,
      width,
      profileType,
      glassType,
      shutterType,
      pricePerUnit,
      quantity,
      idDoor,
      idWindow,
    });
    res.status(200).json({ message: "Product added successfully", productId }); // Send success response with product ID
  } catch (error) {
    console.error("Failed to save product to database:", error); // Log any error
    res.status(500).json({
      error: "Failed to save product to database",
      details: error.message,
    }); // Send error response
  }
});

// Route to delete a product by ID
router.delete("/product/:idProduct", async (req, res) => {
  try {
    await productData.deleteProduct(req.params.idProduct); // Delete the product by ID
    res.json("Product deleted successfully!"); // Send success response
  } catch (err) {
    console.error("Error deleting product:", err.message); // Log any error
    res.status(500).json({ error: "Internal Server Error" }); // Send error response
  }
});

// Route to update a product by ID
router.put("/updateProduct/:idProduct", (req, res) => {
  const { idProduct } = req.params; // Extract product ID from URL parameters
  const {
    description,
    glassType,
    height,
    pricePerUnit,
    profileType,
    quantity,
    shutterType,
    width,
    idDoor,
    idWindow,
  } = req.body;
  const updatedProduct = {
    description,
    glassType,
    height,
    pricePerUnit,
    profileType,
    quantity,
    shutterType,
    width,
    idWindow,
    idDoor,
  };

  // Check if ID and product data are valid
  if (!idProduct || !updatedProduct) {
    return res.status(400).json({ error: "Invalid data" }); // Send error response if invalid data
  }

  // Perform the update operation
  db.query(
    "UPDATE products SET ? WHERE idProduct = ?",
    [updatedProduct, idProduct],
    (error, results) => {
      if (error) {
        console.error("Database error:", error); // Log any error
        return res.status(500).json({ error: "Internal Server Error" }); // Send error response
      }
      res.json({ success: true }); // Send success response
    }
  );
});

// Route to save multiple items
router.post("/saveItems", async (req, res) => {
  try {
    await productData.saveItems(req.body.list); // Save multiple items using productData module
    res.status(200).json({ message: "Items saved successfully!" }); // Send success response
  } catch (err) {
    console.error("Error saving items:", err.message); // Log any error
    res.status(500).json({ error: "Failed to save items. Please try again." }); // Send error response
  }
});

// Route for profile calculations
router.get("/calculate", async (req, res) => {
  try {
    const data = await productData.calculateProfiles(); // Fetch profile calculations using productData module
    res.json(data); // Send the calculations as JSON response
  } catch (err) {
    console.error("Failed to calculate profiles:", err.message); // Log any error
    res
      .status(500)
      .json({ error: "Failed to calculate profiles", details: err.message }); // Send error response
  }
});
// Route to get the cutting plan
router.get("/cutting-plan", async (req, res) => {
  try {
    const data = await productData.getCuttingPlan(); // Fetch the cutting plan using productData module
    res.json(data); // Send the cutting plan as JSON response
  } catch (err) {
    console.error("Failed to get cutting plan:", err.message); // Log any error
    res
      .status(500)
      .json({ error: "Failed to get cutting plan", details: err.message }); // Send error response
  }
});

// Route to get profiles with associations
router.get("/associations", async (req, res) => {
  try {
    const data = await productData.getProfilesWithAssociations(); // Fetch profiles with associations using productData module
    res.json(data); // Send the profile associations as JSON response
  } catch (err) {
    console.error("Failed to fetch profile associations:", err.message); // Log any error
    res.status(500).json({
      error: "Failed to fetch profile associations",
      details: err.message,
    }); // Send error response
  }
});

// New route for foam window data
router.get("/foam-window", async (req, res) => {
  try {
    const data = await productData.getFoamWindowData(); // Fetch foam window data using productData module
    res.json(data); // Send the foam window data as JSON response
  } catch (error) {
    console.error("Error fetching foam window data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam window data" }); // Send error response
  }
});

// New route for foam door data
router.get("/foam-door", async (req, res) => {
  try {
    const data = await productData.getFoamDoorData(); // Fetch foam door data using productData module
    res.json(data); // Send the foam door data as JSON response
  } catch (error) {
    console.error("Error fetching foam door data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam door data" }); // Send error response
  }
});
module.exports = router; // Export the router for use in other modules
