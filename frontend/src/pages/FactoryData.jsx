import React from "react";
import SideBar from "../components/sideBar/SideBar.jsx";
import Factory from '../jsx/Tables/Factory.jsx';
import Footer from "../components/footer/Footer.jsx";
function FactoryData(){
  return (
    <div   >
     {/* sideBar component */}
      <SideBar/>
     {/* factory component */}
      <Factory />
     {/* footer component */}
      <Footer/>
    </div>
  );
}
export default FactoryData;