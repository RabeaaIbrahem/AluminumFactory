export const validateAndSetDimension = (
  //a function that validates and checks the dimentions
  setter,
  value,
  setError,
  min = 100,
  max = 350
) => {
  let error =
    value < min || value > max ? `הערך חייב להיות בין ${min} ל-${max}.` : "";
  setError(error);
  setter(value);
};
