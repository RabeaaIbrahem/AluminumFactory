import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Client from "./Client/Client";
import Product from "./Product";
import styles from "./bidData.module.css";
import axios from "axios";
import editIcon from "../../img/icon/edit.png";
import trash from "../../img/icon/trash.jpg";
// QutationData component manages the process of creating or editing a quotation for a client
function QutationData() {
  const [currentProduct, setCurrentProduct] = useState({
    discountVlaue: "NO", // Toggle for applying a discount
    pricePerUnit: "",
    description: "",
    profileType: "",
    shutterType: "",
    glassType: "",
    idProduct: "",
    windowType: "",
    idWindow: "",
    discount: "",
    quantity: 1, // Default quantity set to 1
    doorType: "",
    idDoor: "",
    height: "",
    width: "",
    vat: "",
  });
  const [customer, setCustomer] = useState({
    address: "",
    family: "",
    phone: "",
    email: "",
    name: "",
    id: "",
  });
  const [quotationId, setQuotationId] = useState(null); // ID for the quotation being edited or created
  const [isEditMode, setIsEditMode] = useState(false); // Flag to indicate whether the form is in edit mode
  const [totalPrice, setTotalPrice] = useState(0); // Total price of all products in the quotation
  const [products, setProducts] = useState([]); // List of products in the quotation
  const [errors, setErrors] = useState({}); // Error handling for the form
  const [notes, setNotes] = useState(""); // Additional notes for the quotation
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Data passed from previous navigation
  const editData = state?.quotation; // Quotation data passed for editing
  // Function to handle date changes
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      alert("תאריך שנבחר עבר, אנא בחר תאריך עתידי.");
      return;
    }
    setDate(selectedDate);
  };
  // Set the default date to today's date
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });

  const convertDateToISO = (dateString) => {
    const [day, month, year] = dateString.split("/"); // Split the date by "/"
    return `${year}-${month}-${day}`; // Return the date in "yyyy-MM-dd" format
  };
  // Handle changes to the discount amount
  const handleDiscountAmountChange = (e) => {
    const { value } = e.target;
    if (value < 0) return; // Ensure discount is not negative
    setCurrentProduct((prevState) => ({
      ...prevState,
      discount: value,
    }));
  };
  // Handle changes to the discount value selection (YES/NO)
  const handleDiscountValueChange = (e) => {
    setCurrentProduct((prevState) => ({
      ...prevState,
      discountVlaue: e.target.value,
      discount: "", // Reset discount amount when toggling value
    }));
  };
  // Fetch the current VAT from the server
  const fetchVAT = async () => {
    try {
      const response = await axios.get("/getVAT");
      return response.data.vat; // Return VAT value from the response
    } catch (error) {
      console.error("Error fetching VAT:", error);
      return 0; // Default VAT value in case of an error
    }
  };
  // Submit the quotation data to the server (either create or update)
  const submitQuotation = async () => {
    if (!customer.id || !date) {
      setErrors({ submit: "Customer ID and Date are required." });
      return;
    }
    currentProduct.vat = await fetchVAT(); // Get VAT and assign to current product
    const quotationData = {
      idCustomer: customer.id,
      customerName: `${customer.name} ${customer.family}`,
      date,
      totalPrice,
      discount: currentProduct.discount,
      notes,
      vat: currentProduct.vat,
    };
    try {
      let response;
      let newQuotationId;
      if (isEditMode && quotationId) {
        console.log("updateQuotation", quotationData);
        response = await axios.put(
          `/updateQuotation/${quotationId}`,
          quotationData
        );
        newQuotationId = quotationId;
      } else {
        response = await axios.post("/createQuotation", quotationData);
        newQuotationId = response?.data?.data?.idQuotation || null;
      }
      if (!newQuotationId) {
        throw new Error("Failed to obtain Quotation ID.");
      }
      // Submit each product in the quotation
      const productPromises = products.map(async (product) => {
        const quotationItemData = {
          idQuotation: newQuotationId,
          idProduct: product.idProduct || null,
          quantity: Number(product.quantity),
          totalPrice:
            product.totalPrice || product.quantity * product.pricePerUnit,
        };
        if (product.idItem && isEditMode) {
          await axios.put(
            `/updateQuotationItem/${product.idItem}`,
            quotationItemData
          );
        } else {
          const resItems = await axios.post(
            "/createQuotationItem",
            quotationItemData
          );
          const newItemId = resItems?.data?.data?.idItem || null;
          product.idItem = newItemId;
        }
        return product;
      });

      const updatedProducts = await Promise.all(productPromises);
      setProducts(updatedProducts);
      if (response.status === 200) {
        navigate(`/quotationInfo`, {
          state: {
            quotation: {
              customer,
              products: updatedProducts,
              date,
              totalPrice,
              notes,
              discount: currentProduct.discount,
              vat: currentProduct.vat || 0,
              idQuotation: newQuotationId,
            },
          },
        });
      } else {
        setErrors({ submit: "Failed to save quotation." });
      }
    } catch (error) {
      console.error("Error submitting quotation:", error);
      setErrors({
        submit: "An error occurred while submitting the quotation.",
      });
    }
  };
  // Handle deletion of a product from the quotation
  const handleDeleteProduct = async (index) => {
    const productToDelete = products[index];
    console.log(
      "Attempting to delete product with idItem:",
      productToDelete.idItem
    );
    try {
      await axios.delete(`/product/${productToDelete.idProduct}`); // Delete product from server
      const updatedProducts = products.filter((_, i) => i !== index); // Remove product from local list
      setProducts(updatedProducts);
      const updatedTotalPrice = updatedProducts.reduce(
        (sum, product) => sum + product.totalPrice,
        0
      ); // Update total price
      setTotalPrice(updatedTotalPrice);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
    if (productToDelete.idItem != null)
      try {
        const response = await axios.delete(
          `/quotationItem/${productToDelete.idItem}`
        ); // Delete item from quotation
        if (response.status === 200) {
          const updatedProducts = products.filter((_, i) => i !== index);
          setProducts(updatedProducts);
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
  };
  // Effect to load existing quotation data when in edit mode
  useEffect(() => {
    if (editData) {
      console.log("Fetched Quotation Data in Edit Mode:", editData);

      setCurrentProduct((prevState) => ({
        ...prevState,
        discount: editData.discount,
        discountVlaue: editData.discount ? "YES" : "NO", // Check if discount exists
      }));

      setQuotationId(editData.idQuotation);
      setTotalPrice(editData.totalPrice);
      // Calculate totalPrice for each product and set the updated products array
      const updatedProducts = editData.products.map((product) => ({
        ...product,
        totalPrice: product.pricePerUnit * product.quantity, // Calculate total price for each product
      }));
      setProducts(updatedProducts);
      setCustomer(editData.customer);
      setNotes(editData.notes || "");
      setIsEditMode(true);

      // Check if the date is not in "yyyy-MM-dd" format and convert if necessary
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      const formattedDate = regex.test(editData.date)
        ? editData.date
        : convertDateToISO(editData.date);

      setDate(formattedDate);
    }
  }, [editData]);

  return (
    <div className={styles.container1}>
      <h1>בניית הצעת מחיר</h1>
      <Client formData={customer} setFormData={setCustomer} />
      <div>
        <label htmlFor="date" style={{ fontWeight: "bolder" }}>
          {" "}
          תאריך{" "}
        </label>
        <br />
        <input
          type="date"
          id="date"
          value={date}
          min={date}
          onChange={handleDateChange}
        />
      </div>
      <Product
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        setProducts={setProducts}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
        products={products}
      />
      <div>
        <label htmlFor="discountVlaue" style={{ fontWeight: "bolder" }}>
          {" "}
          הנחת מזומן
        </label>
        <br />
        <div className={styles.inputField}>
          <select
            id="discountVlaue"
            value={currentProduct.discountVlaue}
            onChange={handleDiscountValueChange}
          >
            <option value="NO">לא</option>
            <option value="YES">כן</option>
          </select>
          {currentProduct.discountVlaue === "YES" && (
            <div>
              <label htmlFor="discount" style={{ fontWeight: "bolder" }}>
                סכום הנחה (ש"ח)
              </label>
              <input
                type="number"
                id="discount"
                value={currentProduct.discount}
                onChange={handleDiscountAmountChange}
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="notes" style={{ fontWeight: "bolder" }}>
          הערות כלליות{" "}
        </label>
        <br />
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "97%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontSize: "16px",
            color: "#333",
            backgroundColor: "#fff",
            outline: "none",
            textAlign: "right",
          }}
        />
      </div>
      {/* Submit button for creating or updating quotation */}
      <button onClick={submitQuotation} className={styles.button}>
        {isEditMode ? "עדכון הצעת מחיר" : "צור הצעת מחיר"}
      </button>
      {errors.submit && <p style={{ color: "red" }}>{errors.submit}</p>}
      {/* Table to display the products in the quotation */}
      <table>
        <thead>
          <tr>
            <th>תאור פריט</th>
            <th>פרופיל</th>
            <th>גובה(מ"מ)</th>
            <th>רוחב(מ"מ)</th>
            <th>ליחידה מחיר(ש"ח)</th>
            <th>כמות</th>
            <th>סה"כ מחיר (ש"ח)</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>
                {product.description}
                {product.windowType} {product.doorType}{" "}
                {product.glassType ? `, זכוכית: ${product.glassType}` : ""}{" "}
                {product.shutterType ? `, תריס: ${product.shutterType}` : ""}
              </td>
              <td>{product.profileType}</td>
              <td>{product.height}</td>
              <td>{product.width}</td>
              <td>{product.pricePerUnit}</td>
              <td>{product.quantity}</td>
              <td>{product.totalPrice}</td>
              <td>
                <img
                  src={editIcon}
                  alt="edit"
                  className={styles.iconAction}
                  onClick={() => setCurrentProduct(product)}
                />
                <img
                  src={trash}
                  alt="remove"
                  className={styles.iconAction}
                  onClick={() => handleDeleteProduct(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QutationData;
