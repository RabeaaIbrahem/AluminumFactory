const ProductValidation = (product) => {
  let errors = {};
  const lettersPattern = /^[\u0590-\u05FF\s]+$/; // Pattern for Hebrew letters and spaces
  const numberPattern = /^\d+$/; // Pattern for numbers
  // Description validation
  if (product.description === "") {
    errors.description = "תאור מוצר זה שדה חובה";
  } else if (!lettersPattern.test(product.description)) {
    errors.description = "תאור מוצר צריך להכיל רק אותיות";
  }
  // Width validation
  if (!product.width) {
    errors.width = " רוחב הוא חובה";
  } else if (!numberPattern.test(product.width)) {
    errors.width = "רוחב צריך להיות מורכב מספרים בלבד";
  } else if (product.width <99 || product.width > 751) {
    errors.width = "רוחב חייב להיות בין 100 ל-750 כולל";
  }
  // Height validation
  if (!product.height) {
    errors.height = " גובה הוא חובה";
  } else if (!numberPattern.test(product.height)) {
    errors.height = "אורך צריך להיות מורכב מספרים בלבד";
  } else if (product.height < 99 || product.height > 751) {
    errors.height = " אורך חייב להיות בין 100 ל- 750 כולל";
  }
if (!product.profileType) {
    errors.profileType = "מקט פרופיל  זה שדה חובה";
    }
  // Quantity validation
  if (!product.quantity) {
    errors.quantity = "כמות מוצר זה שדה חובה";
  } else if (!numberPattern.test(product.quantity)) {
    errors.quantity = "כמות מוצר צריכה להיות מורכבת מספרים בלבד";
  } else if (product.quantity < 1) {
    errors.quantity = "  כמות מוצר לא יכולה להיות אפס או שלילית";
  }
  return errors;
};

export default ProductValidation;
