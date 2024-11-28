import axios from "axios";
import { useState } from "react";
import Validation from "../../../js/validations/CustomerValidation";
// Client component manages form data, checks customer existence, and allows adding or updating customer information.
const Client = ({ formData, setFormData }) => {
  // State hooks to manage customer existence, errors, success messages, and modal visibility.
  const [customerExists, setCustomerExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  // Function to check if the customer already exists in the system by ID.
  const checkIfCustomerExists = async (id) => {
    try {
      const response = await axios.get(`/customer/${id}`);
      console.log("Customer data received:", response.data); // Debugging line
      return response.data; // Return existing customer data if found
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null; // Return null if customer is not found (404)
      } else {
        console.error("Error checking if customer exists:", err.message);
        return null;
      }
    }
  };
  // Event handler for ID input changes, checking if the customer exists after 9 characters.
  const handleIdChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, id }); // Update the form data with the new ID
    setErrors({ ...errors, id: undefined }); // Reset ID errors if any

    if (id.length === 9) {
      const existingCustomer = await checkIfCustomerExists(id);
      if (existingCustomer) {
        setFormData(existingCustomer); // Fill the form with existing customer data
        console.log(
          "Form data updated with existing customer:",
          existingCustomer
        ); // Debugging line
        setCustomerExists(true);
        setSuccessMessage("לקוח קיים נטען בהצלחה");
        setShowAddCustomerModal(true); // Open the modal with existing customer data
      } else {
        // If customer doesn't exist, reset the form fields for new customer entry
        setFormData({
          id,
          name: "",
          family: "",
          address: "",
          phoneNumber: "",
          email: "",
        }); // Clear fields for new customer
        setCustomerExists(false);
        setSuccessMessage("לקוח אינו קיים בבקשה להוסיף אותו"); // Notify that the customer doesn't exist
        setShowAddCustomerModal(true);
      }
    } else {
      setShowAddCustomerModal(false); // Close the modal if ID is not valid
      setCustomerExists(false);
      setSuccessMessage("");
    }
  };
  // Event handler for changes in the customer form input fields (for new customer or editing existing one).
  const handleNewCustomerChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  // Function to handle adding or updating a customer.
  const handleAddCustomer = async () => {
    const validationErrors = Validation(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { id } = formData;
      if (id.length === 9) {
        const existingCustomer = await checkIfCustomerExists(id);

        if (existingCustomer) {
          await axios.put(`/customer/${id}`, formData);
          setSuccessMessage("לקוח נשמר בהצלחה");
        } else {
          await axios.post("/createCustomer", formData);
          setSuccessMessage("לקוח נוצר בהצלחה");
          setCustomerExists(true);
        }
        setShowAddCustomerModal(false); // Close the modal after the operation
        // Optionally, reset form data or load updated data
        setTimeout(() => {
          setSuccessMessage(""); // Clear message after a few seconds
        }, 1000);
      } else {
        setErrors({ ...errors, id: "ID must be 9 characters long" }); // Error if ID is not 9 characters
      }
    } catch (err) {
      console.error(
        "Error saving or fetching customer:",
        err.response?.data?.error || err.message
      );
    }
  };

  return (
    <div>
      {/* ID Input Field */}
      <label htmlFor="id" style={{ fontWeight: "bolder" }}>
        ת.ז לקוח
      </label>
      <input
        type="text"
        placeholder="הכנס ת.ז"
        onChange={handleIdChange}
        maxLength={9}
        value={formData.id}
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
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#66afe9";
          e.target.style.boxShadow = "0 0 8px rgba(102, 175, 233, 0.6)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      />
      {/* Error message for ID */}
      {errors.id && <p style={{ color: "red" }}>{errors.id}</p>}
      {/* Success message for loading or adding customer */}
      {successMessage && (
        <p style={{ color: customerExists ? "green" : "orange" }}>
          {successMessage}
        </p>
      )}
      {/* Modal for adding or updating customer details */}
      {showAddCustomerModal && (
        <div style={style.modalOverlay}>
          <div style={style.modal}>
            <h3 style={{ textAlign: "center" }}>
              {customerExists ? "שמור פרטי לקוח" : "הוספת לקוח חדש"}
            </h3>
            <label htmlFor="name" style={{ fontWeight: "bolder" }}>
              שם לקוח:
            </label>
            <input
              type="text"
              name="name"
              placeholder="שם לקוח"
              value={formData.name}
              onChange={(e) => {
                handleNewCustomerChange(e);
                setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
              }}
              style={style.input}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            <label htmlFor="family" style={{ fontWeight: "bolder" }}>
              שם משפחה:
            </label>
            <input
              type="text"
              name="family"
              placeholder="שם משפחה"
              value={formData.family}
              onChange={(e) => {
                handleNewCustomerChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  family: undefined,
                }));
              }}
              style={style.input}
            />
            {errors.family && <p style={{ color: "red" }}>{errors.family}</p>}
            <label htmlFor="address" style={{ fontWeight: "bolder" }}>
              כתובת:
            </label>
            <input
              type="text"
              name="address"
              placeholder="כתובת"
              value={formData.address}
              onChange={(e) => {
                handleNewCustomerChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  address: undefined,
                }));
              }}
              style={style.input}
            />
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
            <label htmlFor="phoneNumber" style={{ fontWeight: "bolder" }}>
              מספר טלפון:
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="מספר טלפון"
              value={formData.phoneNumber}
              onChange={(e) => {
                handleNewCustomerChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  phoneNumber: undefined,
                }));
              }}
              style={style.input}
            />
            {errors.phoneNumber && (
              <p style={{ color: "red" }}>{errors.phoneNumber}</p>
            )}
            <label htmlFor="email" style={{ fontWeight: "bolder" }}>
              מייל:
            </label>
            <input
              type="text"
              name="email"
              placeholder="מייל"
              value={formData.email}
              onChange={(e) => {
                handleNewCustomerChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: undefined,
                }));
              }}
              style={style.input}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            {/* Save or Add customer button */}
            <button onClick={handleAddCustomer} style={style.button}>
              {customerExists ? "שמור לקוח" : "הוסף לקוח"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const style = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "30%",
    height: "80%",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
};
export default Client;
