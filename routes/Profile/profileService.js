const express = require("express");
const profileData = require("./profileData"); // Import the profile data handling functions. Adjust the path as necessary.
const router = express.Router();

// Route to fetch all profiles
router.get("/profiles", async (req, res) => {
  try {
    // Fetch all profiles using the profileData function
    const data = await profileData.getAllProfiles();
    res.json(data); // Send the profiles data as JSON response
  } catch (err) {
    console.error("Failed to fetch profiles:", err.message); // Log the error
    res.status(500).json({ error: "Failed to fetch profiles" }); // Send a 500 error response
  }
});

// Route to fetch a profile by ID
router.get("/profile/:id", async (req, res) => {
  const id = req.params.id; // Extract profile ID from request parameters
  console.log(`Fetching profile with ID: ${id}`);
  try {
    const data = await profileData.getProfileById(id); // Fetch the profile by ID
    if (data.length === 0) {
      console.log(`Profile with ID ${id} not found`);
      return res.status(404).json({ error: "Profile not found" }); // Send a 404 error if profile not found
    }
    console.log(`Profile found: ${JSON.stringify(data[0])}`);
    return res.status(200).json(data[0]); // Send the profile data as JSON response
  } catch (err) {
    console.error(`Database error: ${err.message}`); // Log the error
    return res.status(500).json({ error: "Database error" }); // Send a 500 error response
  }
});

// Route to create a new profile
router.post("/profile", async (req, res) => {
  try {
    const newProfile = await profileData.createProfile(req.body); // Create a new profile using profileData function
    res.status(201).json(newProfile); // Send the newly created profile data as JSON response
  } catch (err) {
    console.error("Failed to create profile:", err.message); // Log the error
    res.status(500).json({ error: "Failed to create profile" }); // Send a 500 error response
  }
});

// Route to update a profile by ID
router.put("/profile/:id", async (req, res) => {
  try {
    const result = await profileData.updateProfileById(req.params.id, req.body); // Update the profile by ID using profileData function
    if (result) {
      res.json({ message: "Profile updated successfully", data: result }); // Send success message and updated profile data
    } else {
      res.status(404).json({ error: "Profile not found" }); // Send a 404 error if profile not found
    }
  } catch (err) {
    console.error("Failed to update profile:", err.message); // Log the error
    res.status(500).json({ error: "Failed to update profile" }); // Send a 500 error response
  }
});

module.exports = router; // Export the router to use in the main application
