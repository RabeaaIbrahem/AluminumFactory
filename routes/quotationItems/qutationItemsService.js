const express = require("express");
const data = require("./qutationItemsData"); // Assuming data is your database connection file
const router = express.Router();

// Route to fetch all quotation items by idQuotation
router.get("/quotation/:id", async (req, res) => {
  try {
    const quotationId = req.params.id;
    const quotation = await data.getQuotationById(quotationId);

    // Log the complete quotation data, including the products
    console.log("Fetched Quotation Data from Backend:", quotation);

    if (!quotation || quotation.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.json(quotation);
  } catch (err) {
    console.error("Error fetching quotation:", err.message);
    res.status(500).json({ error: "Failed to fetch quotation" });
  }
});
// Route to delete a quotation item by idItem
router.delete("/quotationItem/:idItem", async (req, res) => {
  const idItem = req.params.idItem;
  console.log("Received request to delete item with idItem:", idItem);

  try {
    const result = await data.deleteQuotationItemById(idItem);

    if (result.affectedRows === 0) {
      console.error(`No item found with idItem ${idItem}`);
      return res.status(404).json({ error: "Quotation item not found" });
    }

    res.status(200).json({ message: "Quotation item deleted successfully" });
  } catch (err) {
    console.error("Error deleting quotation item:", err.message);
    res.status(500).json({ error: "Failed to delete quotation item" });
  }
});

// Route to update a quotation item by idItem
router.put("/updateQuotationItem/:idItem", async (req, res) => {
  const { idItem } = req.params;
  const { idQuotation, idProduct, quantity, totalPrice } = req.body;

  if (!idItem || !idQuotation || !idProduct || !quantity || !totalPrice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Update the quotation item in the database
    const result = await data.updateQuotationItemById(idItem, {
      idQuotation,
      idProduct,
      quantity,
      totalPrice,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error updating quotation item:", err.message);
    res.status(500).json({ error: "Failed to update quotation item" });
  }
});

// Route to create a new quotation item
router.post("/createQuotationItem", async (req, res) => {
  const { idQuotation, idProduct, quantity, totalPrice } = req.body;
  // Add logging to track the data being sent
  console.log("Data received in createQuotationItem:", req.body);

  // Check for missing fields
  if (!idQuotation || !idProduct || !quantity || !totalPrice) {
    console.error("Missing required fields:", req.body);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newItemId = await data.createQuotationItem({
      idQuotation,
      idProduct,
      quantity,
      totalPrice,
    });

    // Log the success and new item ID
    console.log("New quotation item created, idItem:", newItemId);

    res.status(200).json({
      message: "Quotation item created successfully",
      data: { idItem: newItemId },
    });
  } catch (error) {
    // Log the error to debug what went wrong
    console.error("Error creating quotation item:", error.message);
    res.status(500).json({ error: "Failed to create quotation item" });
  }
});
module.exports = router;
