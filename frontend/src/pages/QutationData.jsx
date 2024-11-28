import React from "react";
import Qutation from "../jsx/BidShow/QutationData";
import Footer from "../components/footer/Footer.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";

function QutationData() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar />
      {/* order component */}
      <Qutation />
      {/* Footer component with factory name */}
      <Footer name="הר-אל" />
    </div>
  );
}

export default QutationData;
