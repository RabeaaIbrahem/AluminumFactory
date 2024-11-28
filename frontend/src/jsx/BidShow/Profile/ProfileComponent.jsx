import React, { useState, useEffect } from "react";
import axios from "axios";
import Validation from "../../../js/validations/ProfileValidation";
// ProfileComponent manages profile form data, checks if a profile exists, and allows adding or updating profile information
const ProfileComponent = ({ profile, setProfile }) => {
  const [profileExists, setProfileExists] = useState(false); // To track if the profile exists
  const [errors, setErrors] = useState({}); // To track form validation errors
  const [showAddProfileModal, setShowAddProfileModal] = useState(false); // To show or hide the modal
  const [successMessage, setSuccessMessage] = useState("");
  // Function to check if the profile already exists by ID
  const checkIfProfileExists = async (id) => {
    try {
      const response = await axios.get(`/profile/${id}`);
      return response.data; // Return the profile data if found
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null; // Return null if the profile does not exist (404)
      } else {
        console.error("Error checking if profile exists:", err.message);
        return null;
      }
    }
  };
  // Event handler for profile ID changes, checks if the profile exists after entering 5 characters
  const handleIdChange = async (e) => {
    const id = e.target.value;
    setProfile({ ...profile, id }); // Update profile data with the new ID
    setErrors({ ...errors, id: undefined });
    if (id.length === 5) {
      const existingProfile = await checkIfProfileExists(id);
      if (existingProfile) {
        setProfile(existingProfile); // If profile exists, populate the form with profile data
        console.log(
          "Form data updated with existing profile:",
          existingProfile
        );
        setProfileExists(true);
        setSuccessMessage("פרופיל קיים נטען בהצלחה");
        setShowAddProfileModal(true); // Show modal with existing profile data
      } else {
        // If profile doesn't exist, reset form fields for new profile entry
        setProfile({
          id: id,
          perimeter: "",
          weight: "",
          status: 1,
          price: "",
          priceShutters: "",
        });
        setProfileExists(false);
        setSuccessMessage("פרופיל אינו קיים בבקשה להוסיף אותו");
        setShowAddProfileModal(true); // Show modal for new profile
      }
    } else {
      setShowAddProfileModal(false); // Hide modal if ID is not valid
      setProfileExists(false);
      setSuccessMessage("");
    }
  };
  // Event handler for changes in profile input fields (for new or existing profile)
  const handleNewProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value, // Update the profile data with the new values
    }));
  };
  // Function to handle adding or updating a profile
  const handleAddProfile = async () => {
    const validationErrors = Validation(profile); // Validate the form data
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { id } = profile;
      if (id.length === 5) {
        const existingProfile = await checkIfProfileExists(id);

        if (existingProfile) {
          // If profile exists, update the profile data
          await axios.put(`/profile/${id}`, profile);
          setSuccessMessage("פרופיל נשמר בהצלחה");
        } else {
          // If profile doesn't exist, create a new profile
          await axios.post("/profile", profile);
          setSuccessMessage("פרופיל נוצר בהצלחה");
          setProfileExists(true);
        }
        setShowAddProfileModal(false); // Close the modal after the operation

        // Optionally, reset form data or load updated data
        setTimeout(() => {
          setSuccessMessage(""); // Clear message after a few seconds
        }, 1000);
      } else {
        setErrors({ ...errors, id: "ID must be 5 characters long" });
      }
    } catch (err) {
      console.error(
        "Error saving or fetching profile:",
        err.response?.data?.error || err.message
      );
    }
  };

  return (
    <div>
      <label htmlFor="profileId" style={{ fontWeight: "bolder" }}>
        הכנס מק"ט פרופיל
      </label>
      <input
        type="text"
        id="profileId"
        name="id"
        placeholder="הכנס מקט"
        value={profile.id}
        onChange={handleIdChange}
        maxLength={5}
        style={styles.inputField}
        onFocus={(e) => {
          e.target.style.borderColor = "#66afe9";
          e.target.style.boxShadow = "0 0 8px rgba(102, 175, 233, 0.6)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      />

      {errors.id && <p style={styles.errorText}>{errors.id}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {showAddProfileModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center" }}>
              {profileExists ? "ערוך פרופיל קיים:" : "הוספת פרופיל חדש:"}
            </h3>
            <label htmlFor="perimeter" style={{ fontWeight: "bolder" }}>
              היקף
            </label>
            <input
              type="text"
              name="perimeter"
              id="perimeter"
              placeholder="היקף"
              value={profile.perimeter}
              onChange={(e) => {
                handleNewProfileChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  perimeter: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.perimeter && (
              <p style={{ color: "red" }}>{errors.perimeter}</p>
            )}
            <label htmlFor="weight" style={{ fontWeight: "bolder" }}>
              משקל
            </label>
            <input
              type="text"
              name="weight"
              id="weight"
              placeholder="משקל"
              value={profile.weight}
              onChange={(e) => {
                handleNewProfileChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  weight: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.weight && <p style={{ color: "red" }}>{errors.weight}</p>}
            <label htmlFor="price" style={{ fontWeight: "bolder" }}>
              מחיר למטר מרובע
            </label>
            <input
              type="double"
              name="price"
              id="price"
              placeholder=" מחיר למטר מרובע"
              value={profile.price}
              onChange={(e) => {
                handleNewProfileChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  price: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
            <label htmlFor="priceShutters" style={{ fontWeight: "bolder" }}>
              מחיר תריס (1 מטר מרובע)
            </label>
            <input
              type="double"
              name="priceShutters"
              id="priceShutters"
              placeholder="מחיר תריס"
              value={profile.priceShutters}
              onChange={(e) => {
                handleNewProfileChange(e);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  priceShutters: undefined,
                }));
              }}
              style={styles.inputField}
            />
            {errors.priceShutters && (
              <p style={{ color: "red" }}>{errors.priceShutters}</p>
            )}
            <button onClick={handleAddProfile} style={styles.button}>
              {profileExists ? "שמור פרופיל" : "הוסף פרופיל"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the input fields, modal, and buttons
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

export default ProfileComponent;
