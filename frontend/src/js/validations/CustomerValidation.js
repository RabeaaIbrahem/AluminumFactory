import Common_validation1 from "./Common_validation1";

function CustomerValidation(values) {
  const familyname_pattern = /^[\u0590-\u05FF\s]+$/; // Allows only Hebrew letters and spaces
  const address_pattern = /^[\u0590-\u05FF\s]+$/; // Allows letters (uppercase and lowercase), numbers, and spaces
  let errors = {};

  // Call common validation and merge errors
  const commonErrors = Common_validation1(values);
  errors = { ...errors, ...commonErrors };

  //family name validation
  if (!values.family) {
    errors.family = "שם משפחה זה שדה חובה";
  } else if (!familyname_pattern.test(values.family)) {
    errors.family = "שם המשפחה צריך להיות בנוי רק מאותיות עבריות ורווחים";
  }
//address validation
  if (!values.address) {
    errors.address = "כתובת זה שדה חובה";
  } else if (!address_pattern.test(values.address)) {
    errors.address =
      "כתובת צריכה להיות מורכבת מאותיות גדולות, קטנות, מספרים, או רווחים";
  }

  return errors;
}

export default CustomerValidation;
