// Importing necessary modules and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../js/validations/LoginValidation"; // Importing validation logic
import axios from "axios"; // Importing axios for making HTTP requests
import classes from "../css/signup.module.css"; // Importing CSS module for styling

function Login() {
  // Define state variables using useState
  const [values, setValues] = useState({
    id: "", // ID input field
    password: "", // Password input field
  });

  // Initialize navigate function for navigation
  const navigate = useNavigate();

  // State for storing validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value, // Update state with input value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrors(Validation(values)); // Set validation errors

    // Check if there are no validation errors
    if (errors.id === "" && errors.password === "") {
      axios
        .post("/login", values) // Make POST request to login endpoint
        .then((res) => {
          console.log(res); // Log response from server
          if (res.data === "success") {
            // If login was successful, redirect to home page
            navigate("/dashboard");
          } else {
            alert("No such user exists!"); // Alert if login failed
          }
        })
        .catch((err) => console.log(err)); // Log any error that occurs
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.box}>
        <h2 className={classes.title}>כניסה</h2> {/* Page title */}
        <form onSubmit={handleSubmit}>
          <div className={classes.mb}>
            <label htmlFor="id" className={classes.label} dir="ltr">
              <strong>:ת.ז או ח.פ</strong> {/* ID label */}
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
            <label htmlFor="password" className={classes.label}>
              <strong>:סיסמה</strong> {/* Password label */}
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
            <strong>כניסה</strong> {/* Submit button */}
          </button>
          <h5 className={classes.rg}>תיכנס אם אתה מסכים על כל החוקים</h5> {/* Consent message */}
          {/* Link to registration page */}
          <Link to="/signup" className={classes.form}>
            <strong>הרשמה</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
