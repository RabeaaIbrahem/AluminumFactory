const express = require("express");
const data = require("./qutationData");
const router = express.Router();

// Route to fetch all quotations
router.get("/quotations", async (req, res) => {
  try {
    const result = await data.getAllQuotations();
    res.json(result);
  } catch (err) {
    console.error("Error fetching quotations:", err);
    res.status(500).json({ error: "Error fetching quotations" });
  }
});
router.get("/quotations/:idQuotation", async(req, res) => {
  const  id  = req.params.idQuotation;
  console.log(`Fetching quotations with ID: ${id}`);
  try {
    const result = await data.getQuotationById(id);
    if (result.length === 0) {
      console.log(`quotations with ID ${id} not found`);
      return res.status(404).json({ error: "quotations not found" });
    }
    console.log(`quotations found: ${JSON.stringify(data[0])}`);
    return res.status(200).json(result[0]);
  } catch (err) {
    console.error(`Database error: ${err.message}`);
    return res.status(500).json({ error: "Database error" });
  }
});

// Route to create a new quotation
router.post("/createQuotation", async (req, res) => {
  const { idCustomer, customerName, date, totalPrice, discount,vat ,notes} = req.body;
   console.log(vat)
  try {
    // Ensure the customer exists
    const customerExists = await data.checkCustomerExists(idCustomer);
    if (customerExists.length === 0) {
      return res
        .status(404)
        .json({ error: `Customer with id ${idCustomer} not found` });
    }

    // Insert the quotation into the database
    const result = await data.createQuotation({
      idCustomer,
      customerName,
      date,
      totalPrice,
      discount,
      vat,
      notes,
    });
    res.json({
      message: "Quotation created successfully",
      data: result, // Include the idQuotation in the response
    });
  } catch (err) {
    console.error("Error creating quotation:", err);
    res.status(500).json({ error: `Error creating quotation: ${err.message}` });
  }
});

// Route to delete a quotation by idQuotation
router.delete("/quotation/:idQuotation", async (req, res) => {
  const idQuotation = req.params.idQuotation;

  try {
    const result = await data.deleteQuotationById(idQuotation);
    res.json({ message: "Quotation deleted successfully", data: result });
  } catch (err) {
    console.error("Error deleting quotation:", err);
    res.status(500).json({ error: "Error deleting quotation" });
  }
});

// Route to update a quotation by idQuotation
router.put("/updateQuotation/:idQuotation", async (req, res) => {
  const { idCustomer, customerName, date, totalPrice, discount,vat,notes } = req.body;
  const idQuotation = req.params.idQuotation;

  try {
    console.log("Received update for quotation with ID:", idQuotation); // Log the ID to ensure it is received
    const result = await data.updateQuotationById(idQuotation, {
      idCustomer,
      customerName,
      date,
      totalPrice,
      discount,
      vat,
      notes,
    });
    res.json({ message: "Quotation updated successfully", data: result });
  } catch (err) {
    console.error("Error updating quotation:", err);
    res.status(500).json({ error: "Error updating quotation" });
  }
});

// Route to fetch customers with their quotation counts
router.get("/customers/quotation", async (req, res) => {
  try {
    const [ordersData, quotationData] = await Promise.all([
      data.getAllOrders(),
      data.getQuotationCounts(),
    ]);

    // Transform quotationData into a map for quick lookup
    const quotationMap = quotationData.reduce(
      (map, { idCustomer, quotationCount }) => {
        map[idCustomer] = quotationCount;
        return map;
      },
      {}
    );

    // Combine ordersData with quotation counts
    const ordersWithQuotations = ordersData.map((order) => ({
      ...order,
      quotationCount: quotationMap[order.idCustomer] || 0, // Default to 0 if no quotations found
    }));

    res.json(ordersWithQuotations);
  } catch (err) {
    console.error("Error fetching orders with quotation counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get orders within a date range and group by month
router.get("/orderCust", async (req, res) => {
  try {
    const result = await data.getQuotationDetailsByDateRange();
    console.log("Fetched order data:", result); // Log fetched data
    res.json(result);
  } catch (err) {
    console.error("Error fetching order data:", err);
    res.status(500).json({ error: "Error fetching order data" });
  }
});

router.get('/quotationsCustomer/:idCustomer', async (req, res) => {
  const { idCustomer } = req.params;
  try {
    console.log(`Fetching quotations for customer ID: ${idCustomer}`); // Debug log
    const quotations = await data.getQuotationsByCustomerId(idCustomer);
    if (quotations.length === 0) {
      return res.status(404).json({ message: 'No quotations found for this customer.' });
    }
    res.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error); // Detailed error logging
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
