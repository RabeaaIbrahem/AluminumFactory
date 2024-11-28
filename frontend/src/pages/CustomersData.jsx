import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Customer from "../jsx/Tables/Customer.jsx";
import Footer from "../components/footer/Footer.jsx";
function CustomersData() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar/>
      {/* customer component */}
      <Customer />
      {/* Footer component with factory name */}
      <Footer  />
    </div>
  );
}

export default CustomersData;
