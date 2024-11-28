import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Footer from "../components/footer/Footer.jsx";
import Shutter from "../jsx/Tables/Shutter.jsx";
function ShutterInfo() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar />
      <div>
        {/* shutter component */}
        <Shutter />
      </div>
      {/* footer component */}
      <Footer />
    </div>
  );
}

export default ShutterInfo;
