import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./calculations.module.css"; // Import the CSS module for styling
function Calculations() {
  // State variables to store the data from the backend
  const [profiles, setProfiles] = useState([]);
  const [cuttingPlan, setCuttingPlan] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [foamDoor, setFoamDoor] = useState([]);
  const [foamWindow, setFoamWindow] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error messages
  const [activeTab, setActiveTab] = useState("profiles"); // State to track which tab is active

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for all required endpoints simultaneously
        const fetchPromises = [
          axios.get("/calculate"),
          axios.get("/cutting-plan"),
          axios.get("/associations"),
          axios.get("/foam-door"),
          axios.get("/foam-window"),
        ];

        const [
          profilesResponse,
          cuttingPlanResponse,
          associationsResponse,
          foamDoorResponse,
          foamWindowResponse,
        ] = await Promise.all(fetchPromises); // Wait for all requests to complete

        // Update state with the fetched data
        setProfiles(profilesResponse.data);
        setCuttingPlan(cuttingPlanResponse.data);
        setAssociations(associationsResponse.data);
        setFoamDoor(foamDoorResponse.data || []); // Default to empty array if no data
        setFoamWindow(foamWindowResponse.data || []); // Default to empty array if no data

        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        // Handle any errors that occur during data fetching
        console.error("API call failed:", err);
        setError(err.message); // Set the error message
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array means this effect runs once on component mount

  // Display a loading message while data is being fetched
  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  // Display an error message if there was a problem fetching the data
  if (error) {
    return <div className={classes.error}>Error: {error}</div>;
  }

  // Render the navigation tabs and content based on the activeTab state
  return (
    <div className={classes.calculationsContainer}>
      <h2>חישובים סופיים</h2> {/* Main heading for the component */}
      {/* Navigation buttons to switch between tabs */}
      <div className={classes.tabNavigation}>
        <button
          className={activeTab === "profiles" ? classes.activeTab : ""} // Highlight active tab
          onClick={() => setActiveTab("profiles")} // Set active tab to 'profiles'
        >
          פרופילים נצרכים
        </button>
        <button
          className={activeTab === "cuttingPlan" ? classes.activeTab : ""} // Highlight active tab
          onClick={() => setActiveTab("cuttingPlan")} // Set active tab to 'cuttingPlan'
        >
          תוכנית חיתוך
        </button>
        <button
          className={activeTab === "associations" ? classes.activeTab : ""} // Highlight active tab
          onClick={() => setActiveTab("associations")} // Set active tab to 'associations'
        >
          עמותות פרופיל
        </button>
        <button
          className={activeTab === "foamDoor" ? classes.activeTab : ""} // Highlight active tab
          onClick={() => setActiveTab("foamDoor")} // Set active tab to 'foamDoor'
        >
          דלת פורפור
        </button>
        <button
          className={activeTab === "foamWindow" ? classes.activeTab : ""} // Highlight active tab
          onClick={() => setActiveTab("foamWindow")} // Set active tab to 'foamWindow'
        >
          חלון פורפור
        </button>
      </div>
      {/* Conditionally render content based on the activeTab state */}
      {activeTab === "profiles" && (
        <div>
          <h3>פרופילים נצרכים</h3> {/* Section heading for profiles */}
          <table>
            <thead>
              <tr>
                <th>מקט פרופיל</th>
                <th>כמות פרופילים נדרשת ביחידות</th>
                <th>כמות פרופילים נדרשת + חרום ביחידות</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => (
                <tr key={index}>
                  <td>{profile.ProfileId}</td>
                  <td>{profile.RequiredProfiles}</td>
                  <td>{profile.ProfilesWithEmergency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "cuttingPlan" && (
        <div>
          <h3>תוכנית חיתוך</h3> {/* Section heading for cutting plan */}
          <table>
            <thead>
              <tr>
                <th>מקט פרופיל</th>
                <th>רוחב</th>
                <th>אורך</th>
                <th>תוכנית חיתוך אורך</th>
                <th>תוכנית חיתוך רוחב</th>
              </tr>
            </thead>
            <tbody>
              {cuttingPlan.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.ProfileId}</td>
                  <td>{plan.Width}</td>
                  <td>{plan.Length}</td>
                  <td>{plan.LengthCutPlan}</td>
                  <td>{plan.WidthCutPlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "associations" && (
        <div>
          <h3>עמותות פרופיל</h3> {/* Section heading for associations */}
          <table>
            <thead>
              <tr>
                <th>מקט פרופיל</th>
                <th>רוחב</th>
                <th>אורך</th>
                <th>סוג חלון</th>
                <th>סוג דלת</th>
              </tr>
            </thead>
            <tbody>
              {associations.map((association, index) => (
                <tr key={index}>
                  <td>{association.ProfileId}</td>
                  <td>{association.Width}</td>
                  <td>{association.Length}</td>
                  <td>{association.WindowType || "N/A"}</td>
                  <td>{association.DoorType || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "foamDoor" && (
        <div>
          <h3> פרזול דלת </h3> {/* Section heading for foam door */}
          <table>
            <thead>
              <tr>
                <th>מקט פרזול</th>
                <th>כמות</th>
              </tr>
            </thead>
            <tbody>
              {foamDoor.map((door, index) => (
                <tr key={index}>
                  <td>{door.foamId}</td>
                  <td>{door.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "foamWindow" && (
        <div>
          <h3> פרזול חלון </h3> {/* Section heading for foam window */}
          <table>
            <thead>
              <tr>
                <th>מקט פרזול</th>
                <th>כמות</th>
              </tr>
            </thead>
            <tbody>
              {foamWindow.map((window, index) => (
                <tr key={index}>
                  <td>{window.foamId}</td>
                  <td>{window.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default Calculations;
