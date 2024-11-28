import React from "react";
import Order from "../jsx/orderShow/order/OrderComp.jsx";
import SideBar from "../components/sideBar/SideBar.jsx";
import Footer from "../components/footer/Footer.jsx";

function OrderInfo() {
  return (
    <div>     
    {/* sideBar component */}
      <SideBar />
    {/* order component */}
      <Order />
    {/* footer component */}
      <Footer name="הר-אל" />
    </div>
  );
}

export default OrderInfo;
