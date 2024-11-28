import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx"; // Importing the Sidebar component
import Footer from "../components/footer/Footer.jsx"; // Importing the Footer component
import Calculations from "../jsx/orderShow/calculations/Calculations.jsx"; // Importing the Calculations component

// Main component to display calculations information page
function CalculationsInfo() {
  return (
    <div>
      {/* Render the Sidebar component */}
      <SideBar />
      
      {/* Main content area containing the Calculations component */}
      <div>
        <Calculations />
      </div>
      
      {/* Render the Footer component */}
      <Footer />
    </div>
  );
}

export default CalculationsInfo;
