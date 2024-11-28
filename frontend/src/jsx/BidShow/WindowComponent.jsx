import React, { useState, useEffect } from "react";
import axios from "axios";
import Validation from "../../js/validations/WindowValidation";
// WindowComponent manages the addition and updating of window types, including validation and form handling.
const WindowComponent = ({   window ,setWindow }) => {
  const [windowExists, setWindowExists] = useState(false); // State to track if the window type exists
  const [errors, setErrors] = useState({}); // Error handling for form validation
  const [showAddWindowModal, setShowAddWindowModal] = useState(false); // State to control modal visibility
  const [successMessage, setSuccessMessage] = useState(""); // Success message after saving or updating window type
  const [windowTypes, setWindowTypes] = useState([]); // List of available window types
  // Fetch window types when component mounts
  useEffect(() => {
    const fetchWindowTypes = async () => {
      try {
        const response = await axios.get("/windows");
        setWindowTypes(response.data); // Update state with fetched window types
      } catch (err) {
        console.error("Error fetching window types:", err.message);
      }
    };
    fetchWindowTypes();
  }, []);

  // Check if a window type exists
  const checkIfWindowExists = async (windowId) => {
    try {
      const response = await axios.get(`/windows/${windowId}`);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      } else {
        console.error("Error checking if window exists:", err.message);
        return null;
      }
    }
  };

  // Handle change in selected window type
  const handleWindowTypeChange = async (e) => {
    const selectedWindowType = e.target.value;
    setWindow({ ...window, windowType: selectedWindowType }); // Update selected window type in state
    setErrors({ ...errors, windowType: undefined }); // Clear any previous errors

    if (selectedWindowType) {
      if (selectedWindowType === "other") {
        // Show modal to add a new window type
        setWindow({ windowId: "", windowType: "" });
        setWindowExists(false);
        setSuccessMessage("");
        setShowAddWindowModal(true); // Show modal for adding new window type
      } else {
        // Check if the selected window type exists
        const existingWindow = windowTypes.find(
          (win) => win.windowType === selectedWindowType
        );
        // Check if the selected window type exists
        if (existingWindow) {
          setWindow({ ...existingWindow, windowId: existingWindow.idWindow });
          setWindowExists(true);
          setSuccessMessage("סוג חלון קיים נטען בהצלחה");
          setShowAddWindowModal(false);
        } else {
          // Handle case where selected window type does not exist
          setWindow({ windowId: "", windowType: selectedWindowType });
          setWindowExists(false);
          setSuccessMessage("סוג חלון אינו קיים, בבקשה להוסיף אותו");
          setShowAddWindowModal(true);
        }
      }
    } else {
      setWindow({ ...window, windowType: "" }); // Reset window type if no option is selected
      setShowAddWindowModal(false);
      setWindowExists(false);
      setSuccessMessage("");
    }
  };

  // Handle change in new window type input
  const handleNewWindowChange = (event) => {
    const { name, value } = event.target;
    setWindow((prevWindow) => ({ ...prevWindow, [name]: value }));
  };

  // Handle adding or updating a window type
  const handleAddWindow = async () => {
    const validationErrors = Validation(window);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { windowType, windowId } = window;
      if (windowType.length > 0) {
        if (windowExists && windowId) {
          await axios.put(`/windows/${windowId}`, window); // Update existing window type
          setSuccessMessage("סוג חלון נשמר בהצלחה");
        } else {
          const response = await axios.post("/windows", window); // Add new
          setSuccessMessage("סוג חלון נוצר בהצלחה");
          setWindowTypes((prevWindowTypes) => [
            ...prevWindowTypes,
            { ...window, windowId: response.data.windowId },
          ]); // Add new window type to the list
          setWindowExists(true);
        }
        setShowAddWindowModal(false); // Close modal after saving
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
      } else {
        setErrors({ ...errors, windowType: "סוג חלון חייב להיות שם" }); // Error if window type name is missing
      }
    } catch (err) {
      console.error(
        "Error saving or fetching window:",
        err.response?.data?.error || err.message
      );
      setErrors({ ...errors, server: "Error saving window type" });
    }
  };

  return (
    <div>
      {/* Dropdown for selecting window type */}
      <label htmlFor="windowType" style={{ fontWeight: "bolder" }}>
        הכנס סוג חלון
      </label>
      <select
        id="windowType"
        name="windowType"
        value={window.windowType}
        onChange={handleWindowTypeChange}
        style={styles.inputField}
      >
        <option value="">בחר סוג חלון</option>
        {windowTypes.map((type) => (
          <option key={type.windowType} value={type.windowType}>
            {type.windowType}
          </option>
        ))}
        <option value="other">אחר (הוסף סוג חלון חדש)</option>
      </select>

      {errors.windowType && <p style={styles.errorText}>{errors.windowType}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {/* Modal for adding a new window type */}
      {showAddWindowModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center" }}>
              {windowExists ? "ערוך סוג חלון קיים:" : " :הוסף סוג חלון חדש "}
            </h3>
            <label htmlFor="windowType" style={{ fontWeight: "bolder" }}>
              הכנס סוג חלון
            </label>
            <input
              type="text"
              name="windowType"
              id="windowType"
              placeholder="סוג חלון"
              value={window.windowType}
              onChange={(e) => {
                handleNewWindowChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  windowType: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.windowType && (
              <p style={{ color: "red" }}>{errors.windowType}</p>
            )}
            <button onClick={handleAddWindow} style={styles.button}>
              {windowExists ? "שמור סוג חלון" : "הוסף סוג חלון"}
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

export default WindowComponent;
