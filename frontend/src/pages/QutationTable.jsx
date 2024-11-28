import React from "react";
import Footer from "../components/footer/Footer.jsx";
import Bid from "../jsx/Tables/Qutation.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";

function BidData() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar />
      {/* Bid component */}
      <Bid />
      {/* footer component */}
      <Footer />
    </div>
  );
}

export default BidData;
