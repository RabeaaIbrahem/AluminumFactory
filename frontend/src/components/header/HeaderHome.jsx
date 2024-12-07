import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./headerhome.module.css"; // Import CSS module for styling
import menuIcon from "../../img/icon/menu.png"; // Import menu icon image

function Header() {
  const navigate = useNavigate(); // Hook for navigation
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open

  // Function to handle login button click
  const handleLogin = () => {
    navigate("/login"); // Navigate to login page
    setMenuOpen(false); // Close the menu
  };
  // Function to toggle the menu open/closed state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the state of menuOpen
  };

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <h1 className={classes.h1}>הר אל - ניהול וארגון מפעל אלומיניום</h1>
        <div className={classes.menuContainer}>
          <img
            src={menuIcon}
            alt="Menu"
            className={classes.menuIcon}
            onClick={toggleMenu} // Toggle menu on click
          />
          {menuOpen && (
            <div className={classes.dropdownMenu}>
              {/* signin button */}
              <button className={classes.menuItem} onClick={handleLogin}>
                כניסה
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
