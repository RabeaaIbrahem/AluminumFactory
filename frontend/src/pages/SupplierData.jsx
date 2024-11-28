import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Supplier from "../jsx/Tables/Supplier.jsx";
import Footer from "../components/footer/Footer.jsx";
function SupplierData() {
  return (
    <div>
      {/* sideBar component */}
      <SideBar/>
      {/* supplier component */}
      <Supplier />
      {/* Footer component with names */}
      <Footer name="הר-אל" />
    </div>
  );
}

export default SupplierData;
