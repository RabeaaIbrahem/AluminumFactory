// Function to validate form values related to factory information
function FactoryValidation(values) {
  // Regular expression patterns for validating input fields
  const address_pattern = /^[\u0590-\u05FF\s]+$/; // Hebrew letters and spaces
  const vat_pattern = /^\d{2}$/; // Exactly 2 digits for VAT number
  const contact_pattern = /^[\u0590-\u05FF\s]+$/; // Hebrew letters and spaces
  const factoryName_pattern = /^[\u0590-\u05FF\s]+$/; // Hebrew letters and spaces
  const mail_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email format
  const id_pattern = /^\d{9}$/; // Exactly 9 digits for ID
  const phone_pattern = /^\d{10}$/; // Exactly 10 digits for phone number

  // Object to store validation errors
  let errors = {};

  // Validate address field
  if (!values.address || values.address.trim() === "") {
    errors.address = "כתובת זה שדה חובה"; // Address is required
  } else if (!address_pattern.test(values.address)) {
    errors.address = "כתובת צריכה להיות מורכב רק מאותיות עבריות ורווחים"; // Address must contain only Hebrew letters and spaces
  }

  // Validate factory name field
  if (!values.factoryName || values.factoryName.trim() === "") {
    errors.factoryName = "שם עסק זה שדה חובה"; // Factory name is required
  } else if (!factoryName_pattern.test(values.factoryName)) {
    errors.factoryName = "שם מפעל צריך להיות מורכב רק מאותיות עבריות ורווחים"; // Factory name must contain only Hebrew letters and spaces
  }

  // Validate VAT number field
  if (!values.vat || values.vat.trim() === "") {
    errors.vat = "מעם זה שדה חובה"; // VAT number is required
  } else if (!vat_pattern.test(values.vat)) {
    errors.vat = "מעם צריך להיות מורכב מ-2 מספרים"; // VAT number must be exactly 2 digits
  } else if (values.vat <= 0) {
    errors.vat = "מעם לא יכול להיות שלילי או אפס"; // VAT number cannot be negative or zero
  }

  // Validate contact field
  if (!values.contact || values.contact.trim() === "") {
    errors.contact = "איש קשר זה שדה חובה"; // Contact person is required
  } else if (!contact_pattern.test(values.contact)) {
    errors.contact = "איש קשר צריך להיות מורכב רק מאותיות עבריות ורווחים"; // Contact person must contain only Hebrew letters and spaces
  }

  // Validate ID field
  if (!values.id || values.id.trim() === "") {
    errors.id = "ת.ז זה שדה חובה"; // ID is required
  } else if (!id_pattern.test(values.id)) {
    errors.id = "ת.ז צריכה להיות מורכבת מ-9 מספרים"; // ID must be exactly 9 digits
  } else if (values.id <= 0) {
    errors.id = "ת.ז לא יכולה להיות שלילית או אפס"; // ID cannot be negative or zero
  }

  // Validate email field
  if (!values.email || values.email.trim() === "") {
    errors.email = "מייל זה שדה חובה"; // Email is required
  } else if (!mail_pattern.test(values.email)) {
    errors.email = "המייל צריך להכיל @ ו-.com"; // Email must contain @ and a domain
  }

  // Validate phone number field
  if (!values.phoneNumber || values.phoneNumber.trim() === "") {
    errors.phoneNumber = "מספר טלפון זה שדה חובה"; // Phone number is required
  } else if (!phone_pattern.test(values.phoneNumber)) {
    errors.phoneNumber = "מספר טלפון צריך להיות מורכב מ-10 מספרים"; // Phone number must be exactly 10 digits
  } else if (values.phoneNumber < 0) {
    errors.phoneNumber = " מספר טלפון לא יכול להיות שלילי "; // Phone number cannot be negative
  }

  // Return the object containing validation errors
  return errors;
}

export default FactoryValidation; // Export the function for use in other modules
