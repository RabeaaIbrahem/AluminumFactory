const QutationValidation = (quantity) => {
  let errors = {};
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
export default QutationValidation;
