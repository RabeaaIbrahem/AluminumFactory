import React from "react";
import classes from "./footer.module.css"; //importing the footer css
export default function Footer() {
  return (
    <footer className={classes.footer}>
      <section className={classes.footer}>
        {/* Display the current year and the name passed as a prop */}
        &copy; {2024} {"הר-אל"}
      </section>
    </footer>
  );
}
