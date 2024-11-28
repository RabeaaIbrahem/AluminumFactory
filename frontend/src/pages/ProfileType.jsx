import React from "react";
import Profile from "../jsx/Tables/Profile.jsx";
import Footer from "../components/footer/Footer.jsx";
import SiderBar from "../components/sideBar/SideBar.jsx";
function ProfileType() {
  return (
    <div>
      {/* SiderBar component */}
      <SiderBar />
      {/* Profile component */}
      <Profile />
      {/* Footer component with names */}
      <Footer  />
 
    </div>
  );
}

export default ProfileType;
