const alphabeticalPattern = /^[\u0590-\u05FF\s]+$/;//hebrew letters only

function Validation(values) {
  let errors = {};
//shutter type validation
  if (!values.shutterType || values.shutterType === "") {
    errors.shutterType = "סוג תריס זה שדה חובה";
  } else if (!alphabeticalPattern.test(values.shutterType)) {
    errors.shutterType = "סוג תריס צריך להכיל רק אותיות";
  }
//shutter id validation
  if (values.shutterId && !values.shutterId) {
    errors.shutterId = "מזהה תריס זה שדה חובה";
  } else if (parseFloat(values.shutterId) < 0) {
    errors.shutterId = "מזהה תריס לא יכול להיות ערך שלילי";
  }

  return errors;
}

export default Validation;
