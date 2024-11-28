function Validation(values) {
  let error = {}; // Initialize an object to store validation errors
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/; //minimum eight characters, at least one upper one lower one number
  const id_pattern = /^\d{9}$/; //It should be a string of 9 digits

  // Check if the ID field is empty
  if (values.id === "") error.id = " ת.ז זה שדה חובה";
  // Test the ID against the regular expression
  else if (!id_pattern.test(values.id))
    error.id = "ת.ז צריכה להיות מורכבת מ 9 מספרים";
  else if (values.id < 0) error.id = " ת.ז צריכה להיות רק חיובית";
  else {
    error.id = ""; // Reset error if valid
  }
  if (values.password === "") {
    error.password = "שדה סיסמה חובה ";
  }
  // Test the ID against the regular expression
  else if (!password_pattern.test(values.password)) {
    error.password = "סיסמה לא קיימת";
  } else {
    error.password = ""; // Reset error if valid
  }
  return error;
}
export default Validation; // Export the Validation function
