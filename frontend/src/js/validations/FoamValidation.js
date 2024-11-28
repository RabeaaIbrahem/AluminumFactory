function Validation(values) {
  let errors = {}; // Initialize an object to store validation errors

  // Regular expression to validate alphabetic characters only
  const lettersPattern = /^[\u0590-\u05FF\s]+$/;

  // Check if the foam type field is empty
  if (!values.foamType) {
    errors.foamType = "סוג פרזול זה שדה חובה";
  } else if (!lettersPattern.test(values.foamType)) {
    errors.foamType = "סוג פרזול צריך להכיל רק אותיות";
  }

  return errors; // Return the errors object
}

export default Validation; // Export the Validation function
