import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar.jsx"; // Import custom search bar component
import classes from "../../css/table.module.css"; // Import CSS module for styling
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation and getting location state
import addIcon from "../../img/icon/add.png"; // Import add icon

const Qutation = () => {
  const navigate = useNavigate(); // Hook for navigation between routes
  const location = useLocation(); // Hook to access state passed via route navigation
  const { id, name, family } = location.state || {}; // Extract passed customer details from location state
  const [fromDate, setFromDate] = useState(""); // State for 'from date'
  const [toDate, setToDate] = useState(""); // State for 'to date'
  // Component state for quotations (bids), search, form data, errors, etc.
  const [bid, setBid] = useState([]);
  const [message, setMessage] = useState({});
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    idQuotation: "",
    idCustomer: "",
    customerName: "",
    discount: "",
    totalPrice: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Fetch customer-specific quotations or all quotations based on the presence of the customer id
  useEffect(() => {
    if (id) {
      fetchCustomerQuotations(id);
    } else {
      fetchAllQuotations();
    }
  }, [id]);

  // Fetch quotations for a specific customer
  const fetchCustomerQuotations = async (customerId) => {
    try {
      const response = await axios.get(`/quotationsCustomer/${customerId}`); // API request to fetch customer-specific quotations
      setBid(response.data); // Set the retrieved data in state
    } catch (error) {
      console.error("Error fetching customer quotations:", error); // Log any error that occurs
    }
  };

  // Fetch all quotations from the server
  const fetchAllQuotations = async () => {
    try {
      const response = await axios.get("/quotations"); // API request to fetch all quotations
      setBid(response.data); // Set the retrieved data in state
    } catch (error) {
      console.error("Error fetching quotations:", error); // Log any error that occurs
    }
  };

  // Handle input changes and update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data based on input changes
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" }); // Clear any validation errors when user modifies input
    }
  };

  // Filter quotations based on search input
  const filteredBid = bid.filter((quote) => {
    const quoteDate = new Date(quote.date).toISOString().split("T")[0];
    const isWithinDateRange =
      (!fromDate || quoteDate >= fromDate) && (!toDate || quoteDate <= toDate);
    const matchesSearch = quote.idQuotation.toString().includes(search);
    return isWithinDateRange && matchesSearch;
  });

  // Pagination logic to calculate current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBid.slice(indexOfFirstRow, indexOfLastRow);

  // Update the current page when pagination changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the quotation creation page and reset form data
  const handleAddBid = () => {
    setFormData({
      idQuotation: "",
      idCustomer: "",
      customerName: "",
      discount: "",
      totalPrice: "",
      date: "",
    });
    navigate("/qutationData"); // Navigate to the quotation creation page
  };

  // Copy an existing quotation and its associated products, creating new entries for the customer
  const copyQuotation = async (idQuotation) => {
    try {
      const response = await axios.get(`/quotations/${idQuotation}`); // Fetch existing quotation data
      const existingData = response.data;

      const customerResponse = await axios.get(
        `/customer/${existingData.idCustomer}`
      ); // Fetch customer data
      const itemsResponse = await axios.get(`/quotation/${idQuotation}`); // Fetch quotation items

      // Copy products associated with the quotation and create new entries
      const productPromises = itemsResponse.data.map(async (item) => {
        const productResponse = await axios.get(`/product1/${item.idProduct}`);
        const newProductData = {
          ...productResponse.data,
          idProduct: null, // Reset the product ID to create a new product
        };
        const newProductResponse = await axios.post(
          "/createProduct",
          newProductData
        );
        if (!newProductResponse.data.productId) {
          throw new Error(
            "Failed to create a new product. Product ID is missing."
          );
        }

        return {
          ...item,
          idItem: null, // Reset item ID for new creation
          idProduct: newProductResponse.data.productId, // Use the new product ID
        };
      });
      const newItemsWithProducts = await Promise.all(productPromises); // Wait for all product creation promises to resolve

      // Fetch the newly created products and attach to the copied quotation
      const current = await Promise.all(
        newItemsWithProducts.map(async (item) => {
          const { idProduct } = item;
          const productResponse = await axios.get(`/product1/${idProduct}`);
          return {
            ...productResponse.data,
          };
        })
      );

      console.log(current);

      // Format the current date for the copied quotation
      const formattedDate = new Date().toISOString().split("T")[0];

      // Navigate to the quotation data page with the copied data
      navigate("/qutationData", {
        state: {
          quotation: {
            notes: existingData.notes,
            date: formattedDate,
            discount: existingData.discount,
            totalPrice: existingData.totalPrice,
            idQuotation: "",
            products: current, // Attach copied products
            customer: customerResponse.data, // Attach customer data
            vat: existingData.vat || 0, // Attach VAT if applicable
            currentProduct: current,
          },
        },
      });
    } catch (error) {
      console.error("Error copying quotation:", error);
      setMessage({ text: "Error copying quotation.", msgClass: "error" }); // Show error message if copying fails
    }
  };

  // Fetch the full data for a specific quotation and navigate to the details page
  const fetchQuotationData = async (idQuotation) => {
    try {
      const quotationResponse = await axios.get(`/quotations/${idQuotation}`); // Fetch specific quotation data
      const customerResponse = await axios.get(
        `/customer/${quotationResponse.data.idCustomer}`
      ); // Fetch customer data for the quotation
      const itemsResponse = await axios.get(`/quotation/${idQuotation}`); // Fetch items in the quotation

      // Fetch product details associated with the items in the quotation
      const productPromises = itemsResponse.data.map((item) =>
        axios.get(`/product1/${item.idProduct}`)
      );

      const productResponses = await Promise.all(productPromises); // Wait for all product fetch promises to resolve

      // Attach product data to each item in the quotation
      const itemsWithProducts = itemsResponse.data.map((item) => {
        const product = productResponses.find(
          (response) => response.data.idProduct === item.idProduct
        );
        return {
          ...item,
          ...product.data, // Attach product details to the item
        };
      });

      // Format the quotation date for display
      const formattedDate = new Date(
        quotationResponse.data.date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Navigate to the quotation info page with all the fetched data
      navigate("/quotationInfo", {
        state: {
          quotation: {
            notes: quotationResponse.data.notes,
            date: formattedDate,
            discount: quotationResponse.data.discount,
            totalPrice: quotationResponse.data.totalPrice,
            idQuotation: quotationResponse.data.idQuotation,
            products: itemsWithProducts,
            customer: customerResponse.data,
            vat: quotationResponse.data.vat || 0,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data.", error); // Log any error that occurs
    }
  };

  // Navigate to the order material page with the customer's ID
  const handleOrderMaterial = async (customerId, idQuotation) => {
    navigate("/orderinfo", {
      state: { customerId: customerId, idQuotation: idQuotation },
    }); // Navigate to the order material page
  };
  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value; // Get the selected start date from the input
    const nextDay = new Date(selectedStartDate); // Create a date object for the next day
    nextDay.setDate(nextDay.getDate() + 1); // Increment the date by one day

    // Validate the new start date against the current end date
    if (toDate && new Date(toDate) <= new Date(selectedStartDate)) {
      alert("תאריך התחלה צריך להיות יותר קטן מתאריך סיום"); // Show an error if the end date is invalid
    }

    setFromDate(selectedStartDate); // Update the "From Date" state

    // Automatically adjust "To Date" if it's not set or invalid
    if (!toDate || new Date(toDate) <= new Date(selectedStartDate)) {
      setToDate(nextDay.toISOString().split("T")[0]); // Set "To Date" to the next day
    }
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value; // Get the selected end date from the input

    // Validate the end date
    if (!fromDate) {
      alert("בבקשה לבחור קודם תאריך התחלה"); // Show an error if "From Date" is not selected
    } else if (new Date(selectedEndDate) <= new Date(fromDate)) {
      alert("תאריך סיום צריך להיות לפחות גדול ביום אחד מתאריך התחלה"); // Show an error if the end date is invalid
    } else {
      setToDate(selectedEndDate); // Update the "To Date" state if valid
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">הצעות מחיר</h2>
        {id && (
          <h3 className="text-center">
            {" "}
            פרטי לקוח: {name} {family}, {id}
          </h3>
        )}
        {/* Controls for adding a new quotation, showing customer details, and the search bar */}
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddBid}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת הצעת
            מחיר
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>
              מתאריך:
              <input
                type="date"
                value={fromDate}
                onChange={handleStartDateChange} // Calls the updated function
                className={classes.dateInput}
              />
            </label>
            <label>
              עד תאריך:
              <input
                type="date"
                value={toDate}
                onChange={handleEndDateChange} // Calls the updated function
                className={classes.dateInput}
                min={
                  fromDate
                    ? new Date(new Date(fromDate).getTime() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    : "" // Ensures "To Date" cannot be earlier than "From Date + 1 day"
                }
              />
            </label>
          </div>
          <SearchBar
            searchVal={search}
            setSearchVal={setSearch}
            className="search-bar"
          />
        </div>

        {/* Display messages for success or error */}
        {message.text && (
          <div
            className={`alert ${
              message.msgClass === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Table for displaying quotations */}
        <table className={`table ${classes.table}`}>
          <thead>
            <tr>
              <th>העתק</th>
              <th>הזמנת חומר</th>
              <th>תאריך</th>
              <th>סכום סופי</th>
              <th>הנחה</th>
              {!id && <th>שם לקוח</th>}
              {!id && <th>ת.ז לקוח</th>}
              <th>מספר הצעה</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((quote) => (
              <tr key={quote.idQuotation}>
                <td>
                  <button onClick={() => copyQuotation(quote.idQuotation)}>
                    העתק
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleOrderMaterial(quote.idCustomer, quote.idQuotation)
                    }
                  >
                    הזמנת חומר
                  </button>
                </td>
                <td>{new Date(quote.date).toLocaleDateString()}</td>
                <td>
                  {(
                    quote.totalPrice * (1 + quote.vat / 100) -
                    quote.discount
                  ).toFixed(2)}
                </td>
                <td>{quote.discount ? quote.discount : "---"}</td>
                {!id && <td>{quote.customerName}</td>}
                {!id && <td>{quote.idCustomer}</td>}
                <td>
                  <button onClick={() => fetchQuotationData(quote.idQuotation)}>
                    {quote.idQuotation}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({
              length: Math.ceil(filteredBid.length / rowsPerPage),
            }).map((_, index) => (
              <li key={index} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Qutation;
