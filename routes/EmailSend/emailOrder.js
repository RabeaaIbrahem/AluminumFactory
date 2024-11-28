const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const router = express.Router();

const app = express();
// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Route to send an email
router.post("/send-email", async (req, res) => {
  const { email, subject, html } = req.body;

  // Validation of required fields
  if (!email || !subject || !html) {
    return res.status(400).send("Required fields are missing."); // Return error if fields are missing
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail service for sending emails
    auth: {
      user: "hdel.zoabi.16@gmail.com", // Email address to send from
      pass: "sedd xnee bhrq ccag",
    },
    tls: {
      rejectUnauthorized: false, // Disable certificate validation for local development
    },
    debug: true, // Enable debugging to print SMTP messages to the console
  });

  // Email options
  const mailOptions = {
    from: "hdel.zoabi.16@gmail.com", // Sender address
    to: email, // Recipient address
    subject: subject, // Subject of the email
    html: html, // HTML body content
  };

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions); // Send the email
    console.log("Email sent successfully"); // Log success
    res.status(200).send("Email sent successfully"); // Respond with success message
  } catch (error) {
    console.error("Error sending email:", error.message); // Log error message
    if (error.response) {
      console.error("SMTP Response:", error.response); // Log SMTP response if available
    }
    res.status(500).send("Failed to send email"); // Respond with failure message
  }
});

module.exports = router; // Export the router
