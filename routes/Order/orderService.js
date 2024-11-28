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
// router.post("/createOrder", async (req, res) => {
//   const { supplierId, formattedDate, quotationId } = req.body;
//   const status = 1; // default status

//   try {
//     // כאן לא נשלח את ה-`idOrder` כי הוא יווצר אוטומטית
//     await orderData.createOrder({
//       date: formattedDate,
//       supplierId,
//       idQuotation: quotationId,
//       status,
//     });
//     res.json("Order added successfully!");
//   } catch (err) {
//     console.error("Error creating order:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
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

    console.log('New Order Created:', orderId); // Log the new order ID
    res.json({
      message: "Order added successfully!",
      idOrder: orderId,  // Return the id of the newly created order
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Route to get order by orderNumber
router.get("/order/:orderNumber", async (req, res) => {
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
router.get("/orderByQuotation/:quotationId", async (req, res) => {
  const { quotationId } = req.params;
  console.log("Fetching order for quotationId:", quotationId); // הדפסת הפרמטר לקבלת מידע נוסף

  try {
    const order = await orderData.getOrderByQuotation(quotationId);
    console.log("Order fetched:", order); // הדפסת התוצאה כדי לוודא אם היא קיימת
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
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
router.get("/foam-window/:customerId", async (req, res) => {
  const customerId = req.params.customerId; // Get customer ID from route params

  try {
    const data = await orderData.getFoamWindowData(customerId); // Fetch foam window data for the customer
    res.json(data); // Send the foam window data as a JSON response
  } catch (error) {
    console.error("Error fetching foam window data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam window data" }); // Send error response
  }
});
// New route for fetching foam door data for a specific customer
router.get("/foam-door/:customerId", async (req, res) => {
  const customerId = req.params.customerId; // Get customer ID from route params

  try {
    const data = await orderData.getFoamDoorData(customerId); // Fetch foam door data for the customer
    res.json(data); // Send the foam door data as a JSON response
  } catch (error) {
    console.error("Error fetching foam door data:", error); // Log any error
    res.status(500).json({ message: "Failed to fetch foam door data" }); // Send error response
  }
});
// New route for calculating required profiles and profiles with emergency for a specific customer
router.get("/calculate-profiles/:customerId", async (req, res) => {
  const customerId = req.params.customerId; // Extract customerId from the request parameters

  try {
    const data = await orderData.calculateProfile(customerId); // Call the calculateProfiles function
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error("Error fetching profile calculations:", error); // Log any errors
    res.status(500).json({ message: "Failed to fetch profile calculations" }); // Send error response
  }
});
module.exports = router; // Export the router to be used in other modules
