import React from "react";
import Dashboard from "../jsx/dashborad/DashBoard.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";
import Footer from "../components/footer/Footer.jsx";
function DashBoardData() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar />
      {/* dashboard component */}
      <Dashboard />
      {/* footer component */}
      <Footer />
    </div>
  );
}

export default DashBoardData;
