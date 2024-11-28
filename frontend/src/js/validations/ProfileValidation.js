function ProfileValidation(values) {
  const id_pattern = /^\d{5}$/; // It should be a string of 5 digits
  let errors = {}; // Initialize an object to store validation errors
  // Check if the ID field is empty
  if (values.id === "") {
    errors.id = "מקט זה שדה חובה";
  }
  // Test the ID against the regular expression
  else if (!id_pattern.test(values.id) || values.id < 0) {
    errors.id = "מקט צריך להיות מורכב מ-5 לא יכול להיות שלילי מספרים";
  }
  // Check if the profile perimeter field is empty or not numeric or outside the range
  if (values.perimeter === "") {
    errors.perimeter = "היקף זה שדה חובה";
  } else if (
    isNaN(values.perimeter) ||
    values.perimeter < 50 ||
    values.perimeter > 300 ||
    values.perimeter < 1
  ) {
    errors.perimeter = " היקף צריך להיות מספר בין 50 ל-300";
  } else if (values.perimeter < 1)
    errors.perimeter = "היקף לא יכול להיות שלילי או אפס";
  // Check if the profile weight field is empty or not numeric or outside the range
  if (values.weight === "") {
    errors.weight = "משקל זה שדה חובה";
  } else if (
    isNaN(values.weight) ||
    values.weight < 50 ||
    values.weight > 300
  ) {
    errors.weight = "משקל צריך להיות מספר בין 50 ל-300";
  } else if (values.weight < 1)
    errors.weight = "משקל לא יכול להיות שלילי או אפס";
  // Check if the profile price field is empty or not numeric or outside the range
  if (values.price === "") {
    errors.price = "מחיר זה שדה חובה";
  } else if (values.price < 1) errors.price = "מחיר לא יכול להיות שלילי או אפס";
  // Check if the profile price field is empty or not numeric or outside the range
  if (values.priceShutters === "") {
    errors.priceShutters = "מחיר תריס זה שדה חובה";
  } else if (values.priceShutters < 1)
    errors.priceShutters = "מחיר תריס לא יכול להיות שלילי או אפס";
  return errors; // Return the errors object
}
export default ProfileValidation;
