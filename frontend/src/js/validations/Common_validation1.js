function Common_validation1(values) {
  const mail_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;//mail pattern
  const id_pattern = /^\d{9}$/; //number consists of 9 digits
  const phone_pattern = /^\d{10}$/; //number consists of 10 digits
  const name_pattern = /^[\u0590-\u05FF\s]+$/; // Allows only Hebrew letters and spaces

  let errors = {}; // Initialize an object to store validation errors
  //id validation
  if (!values.id) {
    errors.id = "ת.ז זה שדה חובה";
  } else if (!id_pattern.test(values.id)) {
    errors.id = "ת.ז צריכה להיות מורכבת מ-9 מספרים";
  } else if (values.id <= 0) {
    errors.id = "ת.ז לא יכולה להיות שלילית או אפס";
  }
  //email validation
  if (!values.email) {
    errors.email = "מייל זה שדה חובה";
  } else if (!mail_pattern.test(values.email)) {
    errors.email = "המייל צריך להכיל @ ו-.com";
  }
  //phone validation
  if (!values.phoneNumber) {
    errors.phoneNumber = "מספר טלפון זה שדה חובה";
  } else if (!phone_pattern.test(values.phoneNumber)) {
    errors.phoneNumber = "מספר טלפון צריך להיות מורכב מ-10 מספרים";
  } else if (values.phoneNumber < 0) {
    errors.phoneNumber = " מספר טלפון לא יכול להיות שלילי ";
  }
  //name validation
  if (!values.name) {
    errors.name = "שם זה שדה חובה";
  } else if (!name_pattern.test(values.name)) {
    errors.name = "השם צריך להיות בנוי רק מאותיות עבריות ורווחים";
  }

  return errors;
}

export default Common_validation1;
