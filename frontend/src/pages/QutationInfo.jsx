import React from "react";
import Bid from "../jsx/BidShow/QutationInfo.jsx";
import Footer from "../components/footer/Footer.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";
function BidData() {
  return (
    <div>
      <SideBar/>
   {/* bid component */}
      <Bid />
      <Footer/>
    </div>
  );
}

export default BidData;
