// Regular expression patterns for validating input fields
const alphabeticalPattern = /^[\u0590-\u05FF\s]+$/; // Hebrew letters and spaces
const thicknessPattern = /^\d{1,3}$/; // Integer numbers from 1 to 3 digits

// Function to validate form values related to glass specifications
function Validation(values) {
  // Object to store validation errors
  let errors = {};

  // Validate glassType field
  if (!values.glassType || values.glassType === "") {
    errors.glassType = "סוג זכוכית זה שדה חובה"; // Glass type is required
  } else if (!alphabeticalPattern.test(values.glassType)) {
    errors.glassType = "סוג זכוכית צריך להכיל רק אותיות"; // Glass type must contain only letters
  }

  // Validate Thickness field
  if (!values.Thickness || values.Thickness === "") {
    errors.Thickness = "עובי הוא שדה חובה"; // Thickness is required
  } else if (!thicknessPattern.test(values.Thickness)) {
    errors.Thickness = "עובי חייב להיות מספר שלם עד 3 ספרות"; // Thickness must be an integer up to 3 digits
  } else if (parseInt(values.Thickness, 10) > 300) {
    errors.Thickness = "עובי לא יכול להיות גדול מ-300"; // Thickness cannot exceed 300
  } else if (parseInt(values.Thickness, 10) < 1) {
    errors.Thickness = "עובי לא יכול להיות שלילי או אפס"; // Thickness cannot be negative
  }

  // Return the object containing validation errors
  return errors;
}

export default Validation; // Export the function for use in other modules
