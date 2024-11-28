import React, { useState, useEffect } from "react";
import axios from "axios";
import Validation from "../../js/validations/ShtterValidation";
// ShutterComponent manages the addition and updating of shutter types, including validation and form handling.
const ShutterComponent = ({ shutter, setShutter }) => {
  const [shutterExists, setShutterExists] = useState(false); // State to track if the shutter exists
  const [errors, setErrors] = useState({}); // Error handling for form validation
  const [showAddShutterModal, setShowAddShutterModal] = useState(false); // State to control modal visibility
  const [successMessage, setSuccessMessage] = useState(""); // Success message after saving or updating shutter
  const [shutterTypes, setShutterTypes] = useState([]); // List of available shutter types
  // Fetch available shutter types from the server on component mount
  useEffect(() => {
    const fetchShutterTypes = async () => {
      try {
        const response = await axios.get("/shutters");
        setShutterTypes(response.data); // Update state with fetched shutter types
      } catch (err) {
        console.error("Error fetching shutter types:", err.message);
      }
    };
    fetchShutterTypes();
  }, []);
  // Check if the selected shutter type exists in the database
  const checkIfShutterExists = async (shutterType) => {
    try {
      const response = await axios.get(`/shutters/${shutterType}`);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      } else {
        console.error("Error checking if shutter exists:", err.message);
        return null;
      }
    }
  };
  // Handle changes to the shutter type dropdown selection
  const handleShutterTypeChange = async (e) => {
    const selectedShutterType = e.target.value;
    setShutter({ ...shutter, shutterType: selectedShutterType }); // Update the selected shutter type in state
    setErrors({ ...errors, shutterType: undefined }); // Clear any previous errors

    if (selectedShutterType) {
      if (selectedShutterType === "other") {
        // Handle case for adding a new shutter type
        setShutter({
          shutterId: "",
          shutterType: "",
          status: 1,
        });
        setShutterExists(false);
        setSuccessMessage("");
        setShowAddShutterModal(true); // Show modal for adding new shutter type
      } else {
        const existingShutter = shutterTypes.find(
          (shutter) => shutter.shutterType === selectedShutterType
        );
        if (existingShutter) {
          // Populate form with existing shutter data if it exists
          setShutter(existingShutter);
          console.log(
            "Form data updated with existing shutter:",
            existingShutter
          );
          setShutterExists(true);
          setSuccessMessage("סוג תריס קיים נטען בהצלחה");
          setShowAddShutterModal(false);
        } else {
          // Handle case where selected shutter type does not exist
          setShutter({
            shutterId: "",
            shutterType: selectedShutterType,
            status: 1,
          });
          setShutterExists(false);
          setSuccessMessage("סוג תריס אינו קיים, בבקשה להוסיף אותו");
          setShowAddShutterModal(true);
        }
      }
    } else {
      setShutter({
        ...shutter,
        shutterType: "",
      });
      setShowAddShutterModal(false);
      setShutterExists(false);
      setSuccessMessage("");
    }
  };
  // Handle changes to the new shutter form fields
  const handleNewShutterChange = (event) => {
    const { name, value } = event.target;
    setShutter((prevShutter) => ({
      ...prevShutter,
      [name]: value, // Update field value dynamically
    }));
  };
  // Handle adding or updating a shutter type
  const handleAddShutter = async () => {
    const validationErrors = Validation(shutter);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { shutterType, shutterId } = shutter;
      if (shutterType.length > 0) {
        if (shutterExists && shutterId) {
          await axios.put(`/shutters/${shutterId}`, shutter); // Update existing
          setSuccessMessage("סוג תריס נשמר בהצלחה");
        } else {
          await axios.post("/shutters", shutter); // Add new
          setSuccessMessage("סוג תריס נוצר בהצלחה");
          setShutterTypes((prevShutterTypes) => [...prevShutterTypes, shutter]); // Add new shutter type to the list
          setShutterExists(true);
        }
        setShowAddShutterModal(false); // Close modal after saving
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
      } else {
        setErrors({ ...errors, shutterType: "סוג תריס חייב להיות שם" }); // Error if shutter type name is missing
      }
    } catch (err) {
      console.error(
        "Error saving or fetching shutter:",
        err.response?.data?.error || err.message
      );
    }
  };

  return (
    <div>
      {/* Dropdown for selecting shutter type */}
      <label htmlFor="shutterType" style={{ fontWeight: "bolder" }}>
        הכנס סוג תריס
      </label>
      <select
        id="shutterType"
        name="shutterType"
        value={shutter.shutterType}
        onChange={handleShutterTypeChange}
        style={styles.inputField}
      >
        <option value="">בחר סוג תריס</option>
        {shutterTypes.map((type) => (
          <option key={type.shutterType} value={type.shutterType}>
            {type.shutterType}
          </option>
        ))}
        <option value="other">אחר (הוסף סוג תריס חדש)</option>
      </select>

      {errors.shutterType && (
        <p style={styles.errorText}>{errors.shutterType}</p>
      )}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {/* Modal for adding a new shutter type */}
      {showAddShutterModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center" }}>
              {shutterExists ? "ערוך סוג תריס קיים:" : "הוסף סוג תריס חדש:"}
            </h3>
            <label htmlFor="shutterType" style={{ fontWeight: "bolder" }}>
              הכנס סוג תריס
            </label>
            <input
              type="text"
              id="shutterType"
              name="shutterType"
              placeholder="סוג תריס"
              value={shutter.shutterType}
              onChange={(e) => {
                handleNewShutterChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  shutterType: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.shutterType && (
              <p style={{ color: "red" }}>{errors.shutterType}</p>
            )}
            <label htmlFor="status" style={{ fontWeight: "bolder" }}>
              סטטוס
            </label>
            <input
              type="text"
              id="status"
              name="status"
              placeholder="סטטוס"
              value={shutter.status}
              onChange={handleNewShutterChange}
              style={styles.inputField}
              readOnly
            />
            {/* Button to add or save the shutter */}
            <button onClick={handleAddShutter} style={styles.button}>
              {shutterExists ? "שמור סוג תריס" : "הוסף סוג תריס"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  inputField: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    color: "#333",
    backgroundColor: "#fff",
    outline: "none",
  },
  errorText: {
    color: "red",
    marginBottom: "10px",
  },
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
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  },
};

export default ShutterComponent;
