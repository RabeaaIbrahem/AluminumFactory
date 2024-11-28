import Common_validation1 from "./Common_validation1";

function SupplierValidation(values) {
  const contact_pattern = /^[\u0590-\u05FF\s]+$/; // Allows only Hebrew letters and spaces
  let errors = {};

  // Call common validation and merge errors
  const commonErrors = Common_validation1(values);
  errors = { ...errors, ...commonErrors };

  // Check if the contact field is empty
  if (!values.contact) {
    errors.contact = "איש קשר זה שדה חובה";
  } else if (!contact_pattern.test(values.contact)) {
    errors.contact = "איש קשר צריך להיות בנוי רק מאותיות עבריות ורווחים";
  }
 if (!values.address) {
   errors.address = "מקום מגורים זה שדה חובה";
 } else if (!contact_pattern.test(values.address)) {
   errors.address = "מקום מגורים צריך להיות בנוי רק מאותיות עבריות ורווחים";
 }
  return errors;
}

export default SupplierValidation; // Export the validation function
