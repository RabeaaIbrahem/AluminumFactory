import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Foam from "../jsx/Tables/Foam.jsx";
import Footer from "../components/footer/Footer.jsx";

function FoamType() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar/>
      {/* foam component */}
      <Foam />
      {/* Footer component with names */}
      <Footer name="הר-אל" />
    </div>
  );
}

export default FoamType;
