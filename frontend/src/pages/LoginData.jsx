import React from "react";
import Login from "../jsx/Login.jsx";
import Header from "../components/header/HeaderHome.jsx";
import Footer from "../components/footer/Footer.jsx";
import "../css/signup.module.css";
function LoginData() {
  return (
    <div>
      <div className="head">
        {" "}
      {/* header component */}
        <Header />
      </div>
      {/* login component */}
      <Login />
      <div className="foot">
        {" "}
      {/* footer component */}
        <Footer />
      </div>{" "}
    </div>
  );
}

export default LoginData;
