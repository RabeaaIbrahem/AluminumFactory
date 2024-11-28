import React, { useState, useRef, useEffect } from "react"; // Import necessary React hooks
import axios from "axios"; // Import axios for API calls
import classes from "./orders.module.css"; // Import CSS module for styling
import html2canvas from "html2canvas"; // Import html2canvas for capturing DOM elements
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import { useLocation } from "react-router-dom"; // Import useLocation to access router state
import DoorTable from "./Tables/foamDoorData";
import ProfileTable from "./Tables/calculateData";
import WindowTable from "./Tables/foamWindowData";
function OrdersComp() {
  // State variables for managing customer ID, data, loading state, error messages, supplier details, and input visibility
  const [quotationId, setQuotationId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [calculateData, setCalculateData] = useState([]);
  const [foamDoorData, setFoamDoorData] = useState([]);
  const [foamWindowData, setFoamWindowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supplierId, setSupplierId] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [showCustomerIdInput, setShowCustomerIdInput] = useState(true); // Control visibility of customer ID input
  const location = useLocation(); // Access location object from React Router
  const invoiceRef = useRef(null); // Reference to the invoice element for capturing
  const [factory, setFactory] = useState([]);
  const [errors, setErrors] = useState("");
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // חודש מתחיל מ-0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));
  // Effect to update supplierEmail when supplierId changes
  useEffect(() => {
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.id === supplierId
    );
    if (selectedSupplier) {
      setSupplierEmail(selectedSupplier.email); // Update supplier email based on selection
    }
  }, [supplierId, suppliers]);
  // Effect to set customerId and idQuotation  from location state when the component mounts
  useEffect(() => {
    const passedCustomerId = location.state?.customerId;
    if (passedCustomerId) {
      setCustomerId(passedCustomerId);
    }
    const passedQuotationId = location.state?.idQuotation;
    if (passedQuotationId) {
      console.log(passedQuotationId);
      setQuotationId(passedQuotationId);
    }
  }, [location.state]);
  // Effect to fetch material data when customerId changes
  useEffect(() => {
    if (customerId) {
      fetchMaterialData();
    }
  }, [customerId]);

  useEffect(() => {
    // const fetchOrderDetails = async () => {
    //   if (!quotationId) return;

    //   try {
    //     // בדיקה אם קיימת הזמנה להצעת מחיר
    //     const response = await axios.get(`/orderByQuotation/${quotationId}`);
    //     if (response.data && response.data.idOrder) {
    //       // אם קיימת הזמנה, שלוף את הנתונים שלה
    //       const { idOrder, supplierId, date } = response.data;
    //       setOrderId(idOrder); // עדכון מספר ההזמנה
    //       setSupplierId(supplierId); // עדכון מזהה הספק
    //       setFormattedDate(date ? formatDate(date) : formatDate(formattedDate));
    //     } else {
    //       // אם לא קיימת הזמנה, אפשר למשתמש לבחור ספק חדש
    //       alert("No existing order found, please choose a new supplier.");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching order details:", error);
    //     setError(null); // מתעלמים מהשגיאה ומאפשרים למשתמש לבחור ספק חדש
    //   }
    // };
    const fetchOrderDetails = async (quotationId) => {
      // Check if quotationId is defined before making the request
      if (!quotationId) {
        console.log(
          "Quotation ID is undefined or invalid, skipping the request."
        );
        return; // Exit early if quotationId is invalid
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/orderByQuotation/${quotationId}`
        );
        // Handle the successful response
        console.log(response.data);
      } catch (error) {
        // Suppress the error if it's a 404 or handle silently
        if (error.response && error.response.status === 404) {
          console.log("Order not found, ignoring the error.");
        } else {
          console.error("Error fetching order details:", error);
        }
      }
    };

    fetchOrderDetails();
  }, [quotationId]);

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const suppliersResponse = await axios.get("/suppliers");
        console.log("Suppliers Response:", suppliersResponse.data);
        setSuppliers(suppliersResponse.data || []);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchMaterialData();
  }, []);
  useEffect(() => {
    const fetchAllFactories = async () => {
      try {
        const res = await axios.get("/factory"); // בקשת נתונים מהשרת
        setFactory(res.data || []); // שמירת הנתונים
      } catch (err) {
        setErrors("שגיאה בטעינת הנתונים."); // טיפול בשגיאה
      }
    };
    fetchAllFactories();
  }, []);
  if (errors) {
    return <p>{errors}</p>; // הצגת שגיאה אם יש
  }
  // Function to fetch data for calculations and suppliers
  const fetchMaterialData = async () => {
    if (!customerId) {
      alert("Please select a customer."); // Alert if customer ID is not provided
      return;
    }

    setLoading(true); // Set loading state to true
    setError(null); // Reset any existing errors

    try {
      // Make parallel API calls to fetch data
      const fetchPromises = [
        axios.get(`/calculate-profiles/${customerId}`),
        axios.get(`/foam-door/${customerId}`),
        axios.get(`/foam-window/${customerId}`),
        axios.get("/suppliers"),
      ];

      const [
        calculateResponse,
        foamDoorResponse,
        foamWindowResponse,
        suppliersResponse,
      ] = await Promise.all(fetchPromises); // Wait for all responses

      // Update state with the fetched data
      setCalculateData(calculateResponse.data);
      setFoamDoorData(foamDoorResponse.data || []);
      setFoamWindowData(foamWindowResponse.data || []);
      setSuppliers(suppliersResponse.data || []);
      setLoading(false); // Set loading state to false
    } catch (err) {
      console.error("API call failed:", err); // Log any errors
      setError(err.message); // Set error message
      setLoading(false); // Set loading state to false
    }
  };
  // Function to handle printing the invoice
  const handlePrint = () => {
    setShowCustomerIdInput(false); // Hide customer ID input
    setTimeout(() => {
      window.print(); // Trigger print dialog
      setShowCustomerIdInput(true); // Show customer ID input again
    }, 100); // Adjust time as needed
  };
  // Function to handle downloading the invoice as a PDF
  const handleDownloadPDF = async () => {
    setShowCustomerIdInput(false); // Hide customer ID input
    try {
      // Hide buttons and select elements to clean up the PDF appearance
      const elementsToHide = document.querySelectorAll(
        ".submit-btn, select, button"
      );
      elementsToHide.forEach((element) => (element.style.display = "none"));

      const invoiceElement = invoiceRef.current; // Reference to the invoice element
      if (!invoiceElement) {
        alert("Invoice element not found!"); // Alert if invoice element is not found
        return;
      }

      // Capture the invoice element as a canvas
      const canvas = await html2canvas(invoiceElement, { scale: 3 });
      elementsToHide.forEach((element) => (element.style.display = "")); // Restore visibility

      const imgData = canvas.toDataURL("image/png"); // Get image data from canvas
      const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF document

      const imgWidth = 210; // Set image width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate image height
      const pageHeight = 295; // Set page height

      let position = 0; // Initial position
      let heightLeft = imgHeight; // Remaining height

      // Add image to the first page of the PDF
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        Math.min(imgHeight, pageHeight)
      );
      heightLeft -= pageHeight; // Update remaining height

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage(); // Add a new page
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          Math.min(imgHeight, pageHeight)
        );
        heightLeft -= pageHeight; // Update remaining height
      }

      pdf.save(`פרטי_הזמנה.pdf`); // Save the PDF with a specific filename
    } catch (error) {
      console.error("Error generating PDF:", error); // Log any errors
      alert("An error occurred while generating the PDF. Please try again."); // Alert user
    } finally {
      setShowCustomerIdInput(true); // Show customer ID input again
    }
  };
  // Function to handle sending the invoice via email
  const handleSendEmail = async () => {
    setShowCustomerIdInput(false); // Hide customer ID input
    try {
      if (!supplierEmail) {
        alert("Please select a supplier."); // Alert if no supplier is selected
        return;
      }

      const invoiceElement = invoiceRef.current; // Reference to the invoice element
      if (!invoiceElement) {
        alert("Invoice element not found!"); // Alert if invoice element is not found
        return;
      }

      // Hide buttons and select elements for email content
      const elementsToHide = document.querySelectorAll(
        ".submit-btn, select, button"
      );
      elementsToHide.forEach((element) => (element.style.display = "none"));

      const htmlContent = invoiceElement.innerHTML; // Get the inner HTML of the invoice
      elementsToHide.forEach((element) => (element.style.display = "")); // Restore visibility

      // Send email request to the server
      const response = await axios.post("/send-email", {
        email: supplierEmail,
        subject: "Order Details",
        html: htmlContent,
      });

      alert("Order details sent successfully"); // Alert on success
    } catch (error) {
      console.error("Error sending order email:", error.message); // Log any errors
      alert("Error sending order details"); // Alert user
    } finally {
      setShowCustomerIdInput(true); // Show customer ID input again
    }
  };

  // Render loading indicator if data is loading
  if (loading) {
    return <div className={classes.loading}>טוען...</div>;
  }
  // Render error message if there's an error
  if (error) {
    return <div className={classes.error}>שגיאה: {error}</div>;
  }

  //  const saveData = async (selectedSupplierId) => {
  //   console.log("Supplier ID:", selectedSupplierId);
  //   console.log("Quotation ID:", quotationId);
  //   if (!selectedSupplierId || !quotationId) {
  //     alert("Please fill in all required fields.");
  //     return;
  //   }
  //   try {
  //     // Check if an order already exists for the quotation
  //     const checkResponse = await axios
  //       .get(`/orderByQuotation/${quotationId}`)
  //       .catch((error) => {
  //         return { data: null };
  //       });

  //     if (checkResponse.data && checkResponse.data.idOrder) {
  //       // Update the existing order
  //       setOrderId(checkResponse.data.idOrder); // Update orderId immediately
  //       const updateResponse = await axios.put(`/order/${checkResponse.data.idOrder}`, {
  //         supplierId: selectedSupplierId,
  //         formattedDate,
  //         quotationId,
  //       });
  //       console.log("Order updated successfully:", updateResponse.data);
  //       alert("Order updated successfully!");
  //       setOrderId(updateResponse.data.idOrder); // Ensure the new orderId is set
  //     } else {
  //       // No existing order found, create a new one
  //       const createResponse = await axios.post("/createOrder", {
  //         supplierId: selectedSupplierId,
  //         formattedDate,
  //         quotationId,
  //       });

  //       if (createResponse.data && createResponse.data.idOrder) {
  //         console.log("Order saved successfully:", createResponse.data);
  //         alert("Order saved successfully!");
  //         setOrderId(createResponse.data.idOrder); // Set the new orderId
  //       } else {
  //         console.error("Failed to create new order:", createResponse);
  //         alert(`Failed to create new order. Response: ${JSON.stringify(createResponse)}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error saving/updating order:", error.response || error.message);
  //     alert(`Failed to save/update order. Please try again. Error: ${error.response?.data?.message || error.message}`);
  //   }
  // };

  // const handleSupplierChange = (event) => {
  //   const selectedSupplierId = event.target.value;
  //   setSupplierId(selectedSupplierId); // Update the state
  //   saveData(selectedSupplierId); // Pass the selected value to saveData
  // };

  // Main render
  //   return (
  //   <div className={classes.invoice} ref={invoiceRef}>
  //       <header>
  //         <div className={classes.headerButtons}>
  //           <button onClick={handleDownloadPDF}>שמירה</button>
  //           <button onClick={handleSendEmail}>שליחה</button>
  //           <button onClick={handlePrint}>הדפסה</button>
  //         </div>
  //         {factory.map((el) => (
  //           <div key={el.id} className={classes["header-details"]}>
  //             <h1>{el.factoryName}</h1>
  //             <p>ייצור אלומיניום, מסגרות, שערים ומעקות, תריסים, רשתות, ויטרינות</p>
  //             <p>
  //               {el.email} | טלפון: {el.phoneNumber} | {el.address}
  //             </p>
  //           </div>
  //         ))}
  //       </header>

  // <section className={classes.info}>
  //   <div className={classes.row}>
  //     <span>ספק :
  //       <select
  //         onChange={handleSupplierChange}
  //         value={supplierId}
  //       >
  //         <option value="">בחר ספק</option>
  //         {suppliers.map((supplier) => (
  //           <option key={supplier.id} value={supplier.id}>
  //             {supplier.name}
  //           </option>
  //         ))}
  //       </select>
  //     </span>

  //     {/* חישוב selectedSupplier רק אם supplierId קיים */}
  //     {supplierId && (
  //       <>
  //         {(() => {
  //           const selectedSupplier = suppliers.find(
  //             (supplier) => supplier.id === supplierId
  //           );
  //           if (!selectedSupplier) return null;

  //           return (
  //             <>
  //               <span>לכבוד: {selectedSupplier.contact}</span>
  //               <span>כתובת: {selectedSupplier.address}</span>
  //             </>
  //           );
  //         })()}
  //       </>
  //     )}

  //     <span>תאריך: 2024-11-26</span>
  //   </div>

  //   {/* הצגת המידע הנוסף לאחר הבחירה */}
  //   {supplierId && (
  //     <>
  //       <div>
  //         <p className={classes.orderText}>
  //           הזמנת חומר מס': <span>{orderId}</span>
  //         </p>
  //       </div>
  //       <div>
  //         <p>מס' פרויקט: {quotationId}</p>
  //       </div>
  //     </>
  //   )}
  // </section>

  //    <ProfileTable calculateData={calculateData} />
  //    <DoorTable foamDoorData={foamDoorData} />
  //    <WindowTable foamWindowData ={foamWindowData} />
  //     <footer>
  //      <div>
  //       <p>בכבוד רב,</p>
  //       {factory.map((el) => (
  //         <div key={el.id}>{el.contact}</div>
  //       ))}
  //      </div>
  //     </footer>
  //   </div>
  //   );
  // Function to handle saving the order

  // Function to fetch order details
  // const fetchOrderDetails = async (orderId) => {
  //   if (!orderId) {
  //     console.log('Order ID is missing or invalid.');
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(`http://localhost:3001/orderByQuotation/${orderId}`);
  //     console.log('Order details fetched successfully:', response.data);
  //   } catch (error) {
  //     if (error.response && error.response.status === 404) {
  //       console.log('Order not found, ignoring the error.');
  //     } else {
  //       console.error('Error fetching order details:', error);
  //     }
  //   }
  // };

  const saveData = async (selectedSupplierId) => {
    console.log("Supplier ID:", selectedSupplierId);
    console.log("Quotation ID:", quotationId);

    // Ensure both supplierId and quotationId are provided
    if (!selectedSupplierId || !quotationId) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Check if an order already exists for the quotation
      const checkResponse = await axios
        .get(`/orderByQuotation/${quotationId}`)
        .catch((error) => {
          return { data: null };
        });

      if (checkResponse.data && checkResponse.data.idOrder) {
        // Update the existing order
        setOrderId(checkResponse.data.idOrder); // Update orderId immediately
        const updateResponse = await axios.put(
          `/order/${checkResponse.data.idOrder}`,
          {
            supplierId: selectedSupplierId,
            formattedDate,
            quotationId,
          }
        );
        console.log("Order updated successfully:", updateResponse.data);
        alert("Order updated successfully!");
        setOrderId(updateResponse.data.idOrder); // Ensure the new orderId is set
      } else {
        // No existing order found, create a new one
        const createResponse = await axios.post("/createOrder", {
          supplierId: selectedSupplierId,
          formattedDate,
          quotationId,
        });

        console.log("Create Order Response:", createResponse.data); // הדפסת התגובה

        // Check if the order was created successfully
        if (createResponse.data && createResponse.data.idOrder) {
          console.log("Order saved successfully:", createResponse.data);
          alert("Order saved successfully!");
          setOrderId(createResponse.data.idOrder); // Set the new orderId

          // If you need to fetch the new order's details after creation
          fetchOrderDetails(createResponse.data.idOrder);
        } else {
          console.error("Failed to create new order:", createResponse);
        }
      }
    } catch (error) {
      console.error(
        "Error saving/updating order:",
        error.response || error.message
      );
      alert(
        `Failed to save/update order. Please try again. Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Function to fetch order details
  const fetchOrderDetails = async (orderId) => {
    if (!orderId) {
      console.log("Order ID is missing or invalid.");
      return;
    }

    try {
      const response = await axios.get(`/orderByQuotation/${orderId}`);
      console.log("Order details fetched successfully:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Order not found, ignoring the error.");
      } else {
        console.error("Error fetching order details:", error);
      }
    }
  };

  const handleSupplierChange = (event) => {
    const selectedSupplierId = event.target.value;
    setSupplierId(selectedSupplierId);
    console.log("Selected Supplier ID:", selectedSupplierId); // Check the value here
    saveData(selectedSupplierId); // Pass the selected value to saveData
  };

  // רינדור כשלספק יש כבר נתונים
  const renderSupplierDetails = () => {
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.id === supplierId
    );
    if (!selectedSupplier) return null;

    return (
      <>
        <span>לכבוד: {selectedSupplier.contact}</span>
        <span>כתובת: {selectedSupplier.address}</span>
      </>
    );
  };

  // רכיב ה-UI
  return (
    <div className={classes.invoice} ref={invoiceRef}>
      <header>
        <div className={classes.headerButtons}>
          <button onClick={handleDownloadPDF}>שמירה</button>
          <button onClick={handleSendEmail}>שליחה</button>
          <button onClick={handlePrint}>הדפסה</button>
        </div>
        {factory.map((el) => (
          <div key={el.id} className={classes["header-details"]}>
            <h1>{el.factoryName}</h1>
            <p>
              ייצור אלומיניום, מסגרות, שערים ומעקות, תריסים, רשתות, ויטרינות
            </p>
            <p>
              {el.email} | טלפון: {el.phoneNumber} | {el.address}
            </p>
          </div>
        ))}
      </header>

      <section className={classes.info}>
        <div className={classes.row}>
          <span>
            ספק:
            <select onChange={handleSupplierChange} value={supplierId}>
              <option value="">בחר ספק</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </span>
          {renderSupplierDetails()}
          <span>תאריך: {formattedDate}</span>
        </div>
        <div>
          <p>הזמנת חומר מס': {orderId || "טרם נוצרה הזמנה"}</p>
          <p>מס' פרויקט: {quotationId}</p>
        </div>
      </section>

      <ProfileTable calculateData={calculateData} />
      <DoorTable foamDoorData={foamDoorData} />
      <WindowTable foamWindowData={foamWindowData} />

      <footer>
        <div>
          <p>בכבוד רב,</p>
          {factory.map((el) => (
            <div key={el.id}>{el.contact}</div>
          ))}
        </div>
      </footer>
    </div>
  );
}
export default OrdersComp; // Export the component for use in other parts of the application
