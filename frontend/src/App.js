import React from "react";
import LoginData from "./pages/LoginData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupData from "./pages/SignupData";
import Home from "./pages/Home";
import GlassType from "./pages/GlassType";
import ProfileType from "./pages/ProfileType";
import FoamType from "./pages/FoamType";
import SupplierData from "./pages/SupplierData";
import OrderData from "./pages/OrderData";
import CustomersData from "./pages/CustomersData";
import QutationInfo from "./pages/QutationInfo";
import Factory from "./pages/FactoryData";
import QutationData from "./pages/QutationData";
import QutationTable from "./pages/QutationTable";
import Dashboard from "./pages/DashBoardData";
import OrderInfo from "./pages/OrderInfo";
import CalculationsInfo from "./pages/CalculationsInfo";
import SketchComp from "./pages/SketchComp";
import ShutterInfo from "./pages/ShutterInfo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shutter" element={<ShutterInfo />} />
        {/* Route for shutter page */}
        <Route path="/sketch" element={<SketchComp />} />
        {/* Route for sketch page */}
        <Route path="/calculations" element={<CalculationsInfo />}></Route>
        {/* Route for calculations page */}
        <Route path="/orderInfo" element={<OrderInfo />}></Route>        
        {/* Route for order page */}
        <Route path="/dashboard" element={<Dashboard />}></Route>        
        {/* Route for dashboard page */}
        <Route path="/login" element={<LoginData />}></Route>
        {/* Route for login page */}
        <Route path="/signup" element={<SignupData />}></Route>
        {/* Route for signup page */}
        <Route path="/" element={<Home />}></Route>
        {/* Route for home page */}
        <Route path="/glass" element={<GlassType />}></Route>
        {/* Route for GlassType page */}
        <Route path="/profile" element={<ProfileType />}></Route>
        {/* Route for Profile Type page */}
        <Route path="/foam" element={<FoamType />}></Route>
        {/* Route for foam Type page */}
        <Route path="/supplier" element={<SupplierData />}></Route>
        {/* Route for suppliers page */}
        <Route path="/order" element={<OrderData />}></Route>
        {/* Route for order page */}
        <Route path="/customer" element={<CustomersData />}></Route>
        {/* Route for customer  page */}
        <Route path="/quotationInfo" element={<QutationInfo />}></Route>
         {/* Route for quotation info page */}
        <Route path="/qutationData" element={<QutationData />}></Route>
         {/* Route for quotation data page */}
        <Route path="/factory" element={<Factory />}></Route>
        {/* Route for  factory page */}
        <Route path="/qutation" element={<QutationTable />}></Route>
        {/* Route for  quotation page */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
