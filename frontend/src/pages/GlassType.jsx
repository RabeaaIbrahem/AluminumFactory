import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Glass from "../jsx/Tables/Glass.jsx";
import Footer from "../components/footer/Footer.jsx";

function GlassType() {
  return (
    <div>
      {/* SideBar component */}
      <SideBar />
      {/* Glass component */}
      <Glass />
      {/* Footer component with names */}
      <Footer />
    </div>
  );
}

export default GlassType;
