import React from "react";
import styles from "./bidInfo.module.css";

// DatesProduct component displays the product date information
export default function DatesProduct({ date, num }) {
  return (
    // Article to display product details with styling from CSS module
    <article className={styles.invoiceDetails}>
      <ul>
        {/* Display the date with bold styling */}
        <li>
          <span className="font-bold"> תאריך: {date}</span>
        </li>
      </ul>
    </article>
  );
}
