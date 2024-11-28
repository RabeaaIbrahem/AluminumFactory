import React from "react";
import Signup from "../jsx/Signup.jsx";
import Header from "../components/header/HeaderHome.jsx";
import Footer from "../components/footer/Footer.jsx";
import "../css/signup.module.css";
function SignupData() {
  return (
    <div>
      <div className="head">
        {" "}
      {/* header component */}
        <Header />
      </div>
      {/* signup component */}
      <Signup />
      <div className="foot">
        {" "}
      {/* footer component */}
        <Footer  />
      </div>
    </div>
  );
}

export default SignupData;
