function Validation(values) {
  let error = {}; // Initialize an object to store validation errors
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/; //minimum eight characters, at least one upper one lower one number
  const name_pattern = /^[\u0590-\u05FF\s]+$/; // Allows only Hebrew letters and spaces
  const id_pattern = /^\d{9}$/; //It should be a string of 9 digits

  // Check if the ID field is empty
  if (values.id === "") error.id = " ת.ז זה שדה חובה";
  // Test the ID against the regular expression
  else if (!id_pattern.test(values.id))
    error.id = "ת.ז צריכה להיות מורכבת מ 9 מספרים";
  else {
    error.id = ""; // Reset error if valid
  }
  //check if the name field is empty
  if (values.name === "") {
    error.name = " שם זה שדה חובה";
  } else if (!name_pattern.test(values.name)) {
    error.name = "השם צריך להיות בנוי רק מאותיות עבריות ורווחים";
  } else {
    error.name = ""; // Reset error if valid
  }
  // Check if the password field is empty

  if (values.password === "") {
    error.password = "סיסמה זה שדה חובה ";
  }
  // Test the ID against the regular expression
  else if (!password_pattern.test(values.password)) {
    error.password = "הסיסמה אינה קיימת";
  } else {
    error.password = ""; // Reset error if valid
  }
  return error; // Return the validation errors
}
export default Validation;
