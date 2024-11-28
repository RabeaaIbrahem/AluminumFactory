const alphabeticalPattern = /^[\u0590-\u05FF\s]+$/;// Regex pattern to match Hebrew letters and spaces
function Validation(values) {
  let errors = {};
// Validate doorType field
  if (!values.doorType || values.doorType === "") {
    // Error if doorType field is empty
    errors.doorType = "סוג דלת זה שדה חובה";
  } else if (!alphabeticalPattern.test(values.doorType)) {
    // Error if doorType contains characters other than Hebrew letters and spaces
    errors.doorType = "סוג דלת צריך להכיל רק אותיות";
  }

  // Validate doorId field
  if (values.doorId && !values.doorId) {
    // Error if doorId is provided but is empty
    errors.doorId = "מזהה דלת זה שדה חובה";
  } else if (parseFloat(values.doorId) < 0) {
    // Error if doorId is a negative value
    errors.doorId = "מזהה דלת לא יכול להיות ערך שלילי";
  }
  return errors;//return errors object
}

export default Validation;
