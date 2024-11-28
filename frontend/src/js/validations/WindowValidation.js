const alphabeticalPattern = /^[\u0590-\u05FF\s]+$/;//allows only hebrew characters

function Validation(values) {
  let errors = {};
//window type validation
  if (!values.windowType || values.windowType === "") {
    errors.windowType = "סוג חלון זה שדה חובה";
  } else if (!alphabeticalPattern.test(values.windowType)) {
    errors.windowType = "סוג חלון צריך להכיל רק אותיות";
  }
//window id validation
  if (values.windowId  && !values.windowId ) {
    errors.windowId  = "מזהה חלון זה שדה חובה";
  } else if (parseFloat(values.windowId ) < 0) {
    errors.windowId  = "מזהה חלון לא יכול להיות ערך שלילי";
  }

  return errors;
}

export default Validation;
