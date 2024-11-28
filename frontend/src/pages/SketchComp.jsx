import React from "react";
import Sketch from "../components/sketch/Sketch.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";
import Footer from "../components/footer/Footer.jsx";
function SketchComp() {
  return (
    <div>
    {/* sideBar component */}
      <SideBar />
    {/* sketch component */}
      <Sketch />
    {/* footer component */}
      <Footer />
    </div>
  );
}

export default SketchComp;
