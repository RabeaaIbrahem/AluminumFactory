const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

// Setup multer for file handling with destination folder "uploads/"
const upload = multer({ dest: "uploads/" });

// Route to send bid email with PDF attachment
router.post("/send-bid-email", upload.single("pdf"), async (req, res) => {
  const { email } = req.body;
  const pdfPath = req.file?.path; // Path to the uploaded PDF file

  // Check if PDF file is provided
  if (!pdfPath) {
    console.error("PDF file is missing");
    return res.status(400).send("PDF file is missing"); // Return error if PDF file is missing
  }

  // Configure the email transporter using Gmail service
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

  // Email options including attachment
  const mailOptions = {
    from: "hdel.zoabi.16@gmail.com", // Sender address
    to: email, // Recipient address
    subject: "פרטי הצעת מחיר שלך", // Subject of the email in Hebrew
    text: "Please find attached your bid details.", // Text content of the email
    attachments: [
      {
        filename: req.file.originalname, // Original name of the uploaded PDF
        path: pdfPath, // Path to the uploaded PDF file
      },
    ],
  };

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions); // Send the email with the attachment
    console.log("Email sent successfully");

    // Remove the uploaded file after sending the email
    fs.unlink(pdfPath, (err) => {
      if (err) console.error("Error removing file:", err); // Log error if file removal fails
    });

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
