import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Order from "../jsx/Tables/Order.jsx";
import Footer from "../components/footer/Footer.jsx";
function OrderData() {
  return (
    <div>
    {/* sideBar component */}
      <SideBar/>
      {/* order component */}
      <Order />
      {/* Footer component with factory name */}
      <Footer name="הר-אל" />
    </div>
  );
}

export default OrderData;
