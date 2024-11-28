function OrderValidation(values) {
  let errors = {}; // Initialize an object to store validation errors
  const typePattern = /^\d{5}$/;
  const id_pattern = /^\d{9}$/;
  // Check if the count field is empty
  if (values.count === "") {
    errors.count = "כמות מוצר זה שדה חובה";
  }
  // Test the ID against the regular expression
  else if (values.count < 0) {
    errors.count = " כמות מוצר לא יכולה להיות שלילית  ";
  }
  // Check if the order number field is empty
  if (values.orderNumber === "") {
    errors.orderNumber = "מספר הזמנה זה שדה חובה";
  }
  // Test the ID against the regular expression
  else if (values.orderNumber < 0 && values.orderNumber > 3) {
    errors.orderNumber =
      "  מספר הזמנה  לא  יכול להיות שלילי או יותר מ-3 מספרים  ";
  }
  // Check if the type field is empty
  if (values.profileType === "") {
    errors.profileType = "מקט זה שדה חובה";
  } else if (!typePattern.test(values.profileType) || values.profileType < 0) {
    errors.profileType = "מקט צריך להיות מורכב מ-5 לא יכול להיות שלילי מספרים";
  }
  //customer id validartion
  if (!values.customersId) {
    errors.customersId = "ת.ז זה שדה חובה";
  } else if (!id_pattern.test(values.customersId)) {
    errors.customersId = "ת.ז צריכה להיות מורכבת מ-9 מספרים";
  } else if (values.customersId <= 0) {
    errors.customersId = "ת.ז לא יכולה להיות שלילית או אפס";
  }
  //supplier id validation
  if (!values.supplierId) {
    errors.supplierId = "ת.ז זה שדה חובה";
  } else if (!id_pattern.test(values.supplierId)) {
    errors.supplierId = "ת.ז צריכה להיות מורכבת מ-9 מספרים";
  } else if (values.supplierId <= 0) {
    errors.supplierId = "ת.ז לא יכולה להיות שלילית או אפס";
  }
  return errors; // Return the errors object
}

export default OrderValidation;
