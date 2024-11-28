import React, { useState, useEffect } from "react";
import axios from "axios";
import Validation from "../../js/validations/DoorValidation";
// DoorComponent handles door form data, checks if the door exists, allows adding or updating door information
const DoorComponent = ({ door, setDoor }) => {
  const [doorExists, setDoorExists] = useState(false); // To track if the door exists
  const [errors, setErrors] = useState({}); // To store form validation errors
  const [showAddDoorModal, setShowAddDoorModal] = useState(false); // To toggle modal visibility
  const [successMessage, setSuccessMessage] = useState("");
  const [doorTypes, setDoorTypes] = useState([]); // To store available door types fetched from server

  // Fetch the available door types when the component is mounted
  useEffect(() => {
    const fetchDoorTypes = async () => {
      try {
        const response = await axios.get("/doors");
        setDoorTypes(response.data); // Store the door types from the server
      } catch (err) {
        console.error("Error fetching door types:", err.message);
      }
    };
    fetchDoorTypes();
  }, []);
  // Function to check if the door already exists by type
  const checkIfDoorExists = async (doorType) => {
    try {
      const response = await axios.get(`/doors/${doorType}`);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null; // Return null if the door type does not exist
      } else {
        console.error("Error checking if door exists:", err.message);
        return null;
      }
    }
  };
  // Event handler for selecting a door type from the dropdown menu
  const handleDoorTypeChange = async (e) => {
    const selectedDoorType = e.target.value;
    setDoor({ ...door, doorType: selectedDoorType });
    setErrors({ ...errors, doorType: undefined }); // Reset the errors for door type

    if (selectedDoorType) {
      if (selectedDoorType === "other") {
        // If "other" is selected, allow adding a new door type
        setDoor({
          doorId: "",
          doorType: "",
        });
        setDoorExists(false);
        setSuccessMessage("");
        setShowAddDoorModal(true); // Show modal for adding new door type
      } else {
        // Check if the selected door type already exists
        const existingDoor = doorTypes.find(
          (door) => door.doorType === selectedDoorType
        );
        if (existingDoor) {
          setDoor({ ...existingDoor, doorId: existingDoor.idDoor }); // Populate form with existing door data
          setDoorExists(true);
          setSuccessMessage("סוג דלת קיים נטען בהצלחה");
          setShowAddDoorModal(false);
        } else {
          // If the door type doesn't exist, prompt user to add a new one
          setDoor({
            doorId: "",
            doorType: selectedDoorType,
          });
          setDoorExists(false);
          setSuccessMessage("סוג דלת אינו קיים, בבקשה להוסיף אותו");
          setShowAddDoorModal(true); // Show modal for adding new door
        }
      }
    } else {
      setDoor({
        ...door,
        doorType: "",
      });
      setShowAddDoorModal(false);
      setDoorExists(false);
      setSuccessMessage("");
    }
  };
  // Event handler for changes in the form when adding or updating a door
  const handleNewDoorChange = (event) => {
    const { name, value } = event.target;
    setDoor((prevDoor) => ({
      ...prevDoor,
      [name]: value, // Update the door form data with the new values
    }));
  };
  // Function to handle adding or updating a door
  const handleAddDoor = async () => {
    const validationErrors = Validation(door);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Display validation errors if any
      return;
    }

    try {
      const { doorType, doorId } = door;
      if (doorType.length > 0) {
        if (doorExists && doorId) {
          // If door exists, update the existing door data
          await axios.put(`/doors/${doorId}`, door); // Update existing
          setSuccessMessage("סוג דלת נשמר בהצלחה");
        } else {
          // If door does not exist, add a new door
          const response = await axios.post("/doors", door); // Add new
          setSuccessMessage("סוג דלת נוצר בהצלחה");
          setDoorTypes((prevDoorTypes) => [
            ...prevDoorTypes,
            { ...door, doorId: response.data.doorId }, // Update with new doorId
          ]);
          setDoorExists(true);
        }
        setShowAddDoorModal(false);
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000); // Clear success message after a few seconds
      } else {
        setErrors({ ...errors, doorType: "סוג דלת חייב להיות שם" });
      }
    } catch (err) {
      console.error(
        "Error saving or fetching door:",
        err.response?.data?.error || err.message
      );
    }
  };

  return (
    <div>
      {/* Dropdown to select door type */}
      <label htmlFor="doorType" style={{ fontWeight: "bolder" }}>
        הכנס סוג דלת
      </label>
      <select
        id="doorType"
        name="doorType"
        value={door.doorType}
        onChange={handleDoorTypeChange}
        style={styles.inputField}
      >
        <option value="">בחר סוג דלת</option>
        {doorTypes.map((type) => (
          <option key={type.doorId} value={type.doorType}>
            {type.doorType}
          </option>
        ))}
        <option value="other">אחר (הוסף סוג דלת חדש)</option>
      </select>

      {errors.doorType && <p style={styles.errorText}>{errors.doorType}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {/* Modal for adding or updating door type */}
      {showAddDoorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center" }}>
              {doorExists ? "ערוך סוג דלת קיים:" : "הוסף סוג דלת חדש:"}
            </h3>
            <label htmlFor="doorType" style={{ fontWeight: "bolder" }}>
              הכנס סוג דלת
            </label>
            <input
              type="text"
              name="doorType"
              id="doorType"
              placeholder="סוג דלת"
              value={door.doorType}
              onChange={(e) => {
                handleNewDoorChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  perimeter: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.doorType && (
              <p style={styles.errorText}>{errors.doorType}</p>
            )}
            <button onClick={handleAddDoor} style={styles.button}>
              {doorExists ? "שמור סוג דלת" : "הוסף סוג דלת"}
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

export default DoorComponent;
