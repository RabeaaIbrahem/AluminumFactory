import React, { useState, useEffect } from "react";
import axios from "axios";
import Validation from "../../js/validations/GlassValidation";
// GlassComponent manages glass data, checks if glass type exists, and allows adding or updating glass types
const GlassComponent = ({ glass, setGlass }) => {
  const [glassExists, setGlassExists] = useState(false); // Track if the glass type exists
  const [errors, setErrors] = useState({}); // Track validation errors
  const [showAddGlassModal, setShowAddGlassModal] = useState(false); // Control modal visibility
  const [successMessage, setSuccessMessage] = useState(""); // Display success messages
  const [glassTypes, setGlassTypes] = useState([]); // Store glass types fetched from the server

  // useEffect hook to fetch glass types from the server when the component is mounted
  useEffect(() => {
    const fetchGlassTypes = async () => {
      try {
        const response = await axios.get("/glass");
        setGlassTypes(response.data); // Save glass types in the state
      } catch (err) {
        console.error("Error fetching glass types:", err.message);
      }
    };
    fetchGlassTypes(); // Call the function to fetch glass types
  }, []);
  // Function to check if a glass type already exists
  const checkIfGlassExists = async (glassType) => {
    try {
      const response = await axios.get(`/glass1/${glassType}`);
      return response.data; // Return glass data if found
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null; // Return null if glass type does not exist
      } else {
        console.error("Error checking if glass exists:", err.message);
        return null;
      }
    }
  };
  // Event handler for changing the glass type in the form
  const handleGlassTypeChange = async (e) => {
    const selectedGlassType = e.target.value;
    setGlass({ ...glass, glassType: selectedGlassType }); // Update glass type in the form
    setErrors({ ...errors, glassType: undefined }); // Clear glassType errors

    if (selectedGlassType) {
      if (selectedGlassType === "other") {
        // If "other" is selected, allow adding a new glass type
        setGlass({
          glassType: "",
          Thickness: "",
          status: 1,
        });
        setGlassExists(false);
        setSuccessMessage("");
        setShowAddGlassModal(true); // Show the modal for adding a new glass type
      } else {
        const existingGlass = await checkIfGlassExists(selectedGlassType);
        if (existingGlass) {
          setGlass(existingGlass); // Populate the form with existing glass data
          console.log("Form data updated with existing glass:", existingGlass);
          setGlassExists(true);
          setSuccessMessage("סוג זכוכית קיים נטען בהצלחה");
          setShowAddGlassModal(false); // Close the modal if glass exists
        } else {
          // If the glass type doesn't exist, allow adding a new one
          setGlass({
            glassType: selectedGlassType,
            Thickness: "",
            status: 1,
          });
          setGlassExists(false);
          setSuccessMessage("סוג זכוכית אינו קיים, בבקשה להוסיף אותו"); // Prompt for adding new glass
          setShowAddGlassModal(true);
        }
      }
    } else {
      setGlass({
        ...glass,
        glassType: "", // Reset glassType if no option is selected
      });
      setShowAddGlassModal(false);
      setGlassExists(false);
      setSuccessMessage("");
    }
  };
  // Event handler for handling new input values for the glass form
  const handleNewGlassChange = (event) => {
    const { name, value } = event.target;
    setGlass((prevGlass) => ({
      ...prevGlass,
      [name]: value, // Update the glass form data with the new values
    }));
  };
  // Function to handle adding or updating a glass type

  const handleAddGlass = async () => {
    const validationErrors = Validation(glass);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors if any
      return;
    }

    try {
      const { glassType } = glass;
      if (glassType.length > 0) {
        const existingGlass = await checkIfGlassExists(glassType);

        if (existingGlass) {
          // If glass type exists, update the existing glass
          await axios.put(`/update/${glassType}`, glass);
          setSuccessMessage("סוג זכוכית נשמר בהצלחה");
        } else {
          // If glass type doesn't exist, add a new glass type
          await axios.post("/create", glass);
          setSuccessMessage("סוג זכוכית נוצר בהצלחה");
          setGlassTypes((prevGlassTypes) => [...prevGlassTypes, glass]); // Add the new glass to the list
          setGlassExists(true);
        }
        setShowAddGlassModal(false); // Close the modal after the operation
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
      } else {
        setErrors({ ...errors, glassType: "סוג זכוכית חייב להיות שם" }); // Error if no glass type is provided
      }
    } catch (err) {
      console.error(
        "Error saving or fetching glass:",
        err.response?.data?.error || err.message
      );
    }
  };

  return (
    <div>
      {/* Dropdown for selecting glass type */}
      <label htmlFor="glassType" style={{ fontWeight: "bolder" }}>
        הכנס סוג זכוכית
      </label>
      <select
        id="glassType"
        name="glassType"
        value={glass.glassType}
        onChange={handleGlassTypeChange}
        style={styles.inputField}
      >
        <option value="">בחר סוג זכוכית</option>
        {glassTypes.map((type) => (
          <option key={type.glassType} value={type.glassType}>
            {type.glassType}
          </option>
        ))}
        <option value="other">אחר (הוסף סוג זכוכית חדש)</option>
      </select>
      {/* Display validation errors and success messages */}
      {errors.glassType && <p style={styles.errorText}>{errors.glassType}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {/* Modal for adding or updating glass type */}
      {showAddGlassModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center" }}>
              {glassExists ? "ערוך סוג זכוכית קיים:" : "הוסף סוג זכוכית חדש:"}
            </h3>
            <label htmlFor="glassType" style={{ fontWeight: "bolder" }}>
              הכנס סוג זכוכית
            </label>
            <input
              type="text"
              name="glassType"
              id="glassType"
              placeholder="סוג זכוכית"
              value={glass.glassType}
              onChange={(e) => {
                handleNewGlassChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  glassType: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.glassType && (
              <p style={{ color: "red" }}>{errors.glassType}</p>
            )}
            <label htmlFor="Thickness" style={{ fontWeight: "bolder" }}>
              עובי
            </label>
            <input
              type="text"
              name="Thickness"
              id="Thickness"
              placeholder="עובי"
              value={glass.Thickness}
              onChange={(e) => {
                handleNewGlassChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  Thickness: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.Thickness && (
              <p style={{ color: "red" }}>{errors.Thickness}</p>
            )}
            {/* Button to save or add glass type */}
            <button onClick={handleAddGlass} style={styles.button}>
              {glassExists ? "שמור סוג זכוכית" : "הוסף סוג זכוכית"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for input fields, modal, and buttons
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

export default GlassComponent;
