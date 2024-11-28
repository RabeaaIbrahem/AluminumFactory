// Import necessary modules and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Modules from react-router-dom library for routing
import Validation from "../js/validations/SignupValidation"; // Importing validation logic
import axios from "axios"; // Importing axios for making HTTP requests
import classes from "../css/signup.module.css"; // Importing CSS module for styling

function Signup() {
  // Define state variables using useState
  const [values, setValues] = useState({
    id: "", // ID input field
    name: "", // Name input field
    password: "", // Password input field
  });

  // Initialize navigate function for navigation
  const navigate = useNavigate();

  // Define state variable to store validation errors
  const [errors, setErrors] = useState({});

  // Function to handle input changes
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value, // Update state with input value
    }));
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    setErrors(Validation(values)); // Set validation errors based on input values

    // Check if there are no validation errors
    if (
      errors.name === "" &&
      errors.id === "" &&
      errors.password === ""
    ) {
      axios
        .post("/signup", values) // Make a POST request to the signup endpoint with form values
        .then((res) => {
          navigate("/login"); // Redirect to login page upon successful signup
        })
        .catch((err) => console.log(err)); // Log any errors that occur during the request
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.box}>
        <h2 className={classes.title}>הרשמה</h2> {/* Page title */}
        <form action="" onSubmit={handleSubmit}>
          <div className={classes.mb}>
            <label htmlFor="id" className={classes.label}>
              <strong> :ת.ז או ח.פ </strong> {/* ID label */}
            </label>
            <input
              type="number"
              placeholder="הכנס ת.ז או ח.פ"
              name="id"
              onChange={handleInput}
              className={classes.control}
            />
            {/* Display validation error for ID if any */}
            {errors.id && <span className={classes.error}>{errors.id}</span>}
          </div>
          <div className={classes.mb}>
            <label htmlFor="name" className={classes.label}>
              <strong> :שם מפעל </strong> {/* Name label */}
            </label>
            <input
              type="text"
              name="name"
              onChange={handleInput}
              placeholder=" הכנס שם מפעל"
              className={classes.control}
            />
            {/* Display validation error for name if any */}
            {errors.name && <span className={classes.error}>{errors.name}</span>}
          </div>
          <div className={classes.mb}>
            <label htmlFor="password" className={classes.label}>
              <strong> :סיסמה </strong> {/* Password label */}
            </label>
            <input
              type="password"
              placeholder="הכנס סיסמה"
              name="password"
              onChange={handleInput}
              className={classes.control}
            />
            {/* Display validation error for password if any */}
            {errors.password && (
              <span className={classes.error}>{errors.password}</span>
            )}
          </div>
          <button type="submit" className={classes.form}>
            <strong>הרשמה</strong> {/* Submit button */}
          </button>
          <h5 className={classes.rg}>תיכנס אם אתה מסכים על כל החוקים</h5> {/* Consent message */}
          {/* Link to login page */}
          <Link to="/login" className={classes.form}>
            <strong>כניסה</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
