const BidValidation = (formData) => {
  let errors = {};

  // Regular expression for 9 digits
  const idPattern = /^\d{9}$/;

  // Regular expression to ensure customerName contains only Hebrew letters
  const hebrewPattern = /^[\u0590-\u05FF\s]+$/;

  // idCustomer validation (must be 9 digits)
  if (!formData.idCustomer.trim()) {
    errors.idCustomer = "תעודת הזהות היא שדה חובה";
  } else if (!idPattern.test(formData.idCustomer)) {
    errors.idCustomer = "תעודת הזהות חייבת להיות מורכבת מ-9 ספרות";
  }

  // customerName validation (must be in Hebrew)
  if (!formData.customerName.trim()) {
    errors.customerName = "שם הלקוח הוא שדה חובה";
  } else if (!hebrewPattern.test(formData.customerName)) {
    errors.customerName = "שם הלקוח חייב להיות בעברית";
  }

  // Discount validation (optional)
  if (formData.discount && parseFloat(formData.discount) < 0) {
    errors.discount = "הנחה לא יכולה להיות ערך שלילי";
  }

  // TotalPrice validation
  if (!formData.totalPrice.trim()) {
    errors.totalPrice = "סכום כולל הוא שדה חובה";
  } else if (parseFloat(formData.totalPrice) < 0) {
    errors.totalPrice = "סכום כולל לא יכול להיות ערך שלילי";
  }

  // Date validation
  if (!formData.date) {
    errors.date = "תאריך הוא חובה";
  } else {
    const today = new Date();
    const inputDate = new Date(formData.date);
    if (inputDate < today) {
      errors.date = "תאריך לא יכול להיות בעבר";
    }
  }
  return errors;
};
export default BidValidation;
