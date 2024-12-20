const express = require("express");
const orderData = require("./orderData"); // Importing the database interaction functions
const router = express.Router();

// Route to fetch all orders
router.get("/order", async (req, res) => {
  try {
    const data = await orderData.getAllOrders(); // Fetch all orders from the database
    res.json(data); // Send the retrieved data as a JSON response
  } catch (err) {
    console.error("Error fetching orders:", err); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Send a 500 error response if something goes wrong
  }
});

// Route to create a new order
router.post("/createOrder", async (req, res) => {
  const { supplierId, formattedDate, quotationId } = req.body;
  const status = 1; // default status

  try {
    // Create the order in the database
    const newOrder = await orderData.createOrder({
      date: formattedDate,
      supplierId,
      idQuotation: quotationId,
      status,
    });

    // Assuming newOrder is the result object returned by MySQL
    const orderId = newOrder.insertId; // Get the insertId from the result

    console.log("New Order Created:", orderId); // Log the new order ID
    res.json({
      message: "Order added successfully!",
      idOrder: orderId, // Return the id of the newly created order
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Route to get order by orderNumber
router.get("/order/:idOrder", async (req, res) => {
  const { idOrder } = req.params; // Extract orderNumber from the route parameters

  try {
    const order = await orderData.getOrderById(idOrder); // Fetch order details by orderNumber from the database
    res.json(order); // Send the retrieved order details as a JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send a 500 error response if something goes wrong
  }
});

// Route to delete an order by orderNumber
router.delete("/order/:idOrder", async (req, res) => {
  const idOrder = req.params.idOrder; // Extract orderNumber from the route parameters

  try {
    const data = await orderData.deleteOrder(idOrder); // Delete the order by orderNumber from the database
    res.json(data); // Send a success message or the result as a JSON response
  } catch (err) {
    console.error("Error deleting order:", err); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Send a 500 error response if something goes wrong
  }
});
// Route to get the order details by the idQuotation
router.get("/orderByQuotation/:idQuotation", async (req, res) => {
  const { idQuotation } = req.params;

  try {
    const order = await orderData.getOrderByQuotation(idQuotation);

    if (!order) {
      return res
        .status(200)
        .json({ message: "No order found for this quotation", order: null });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update an order by orderNumber
router.put("/order/:idOrder", async (req, res) => {
  const { idOrder } = req.params;
  const { supplierId, formattedDate, quotationId } = req.body;

  try {
    const updatedOrder = await orderData.updateOrder(
      idOrder,
      supplierId,
      formattedDate,
      quotationId
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Route to fetch supplier orders count
router.get("/suppliers/orders", async (req, res) => {
  try {
    const supplierOrdersData = await orderData.getSupplierOrdersCount(); // Fetch the count of orders per supplier from the database
    res.json(supplierOrdersData); // Send the supplier orders data as a JSON response
  } catch (err) {
    console.error("Error fetching supplier orders:", err); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Send a 500 error response if something goes wrong
  }
});
// New route for fetching foam window data for a specific customer
router.get("/foam-window/:idQuotation", async (req, res) => {
  const idQuotation = req.params.idQuotation; // Get quotation ID from route params

  try {
    const data = await orderData.getFoamWindowData(idQuotation); // Fetch foam window data for the customer based on the id quotation
    res.json(data); // Send the foam window data as a JSON response
  } catch (error) {
    console.error("Error fetching foam window data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam window data" }); // Send error response
  }
});
// New route for fetching foam door data for a specific customer
router.get("/foam-door/:idQuotation", async (req, res) => {
  const idQuotation = req.params.idQuotation; // Get customer ID from route params

  try {
    const data = await orderData.getFoamDoorData(idQuotation); // Fetch foam door data for the customer based on the id quotation
    res.json(data); // Send the foam door data as a JSON response
  } catch (error) {
    console.error("Error fetching foam door data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam door data" }); // Send error response
  }
});
// New route for calculating required profiles and profiles with emergency for a specific customer
router.get("/calculate-profiles/:idQuotation", async (req, res) => {
  const idQuotation = req.params.idQuotation; // Extract customerId from the request parameters

  try {
    const data = await orderData.calculateProfile(idQuotation); // Call the calculateProfiles function
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error("Error fetching profile calculations:", error); // Log any errors
    res.status(500).json({ message: "Failed to fetch profile calculations" }); // Send error response
  }
});
module.exports = router; // Export the router to be used in other modules
