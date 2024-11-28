import React from "react";
import styles from "../bidInfo.module.css";

// ClientDetails component displays the customer's name, family, and address
export default function ClientDatails({ name, family, address }) {
  return (
    // Section to display client details in an invoice-like layout with styles applied from CSS module
    <section className={styles.invoiceSection}>
      <div className={styles.sectionLeft}>
        {/* Display customer name and family */}
        <h3>
          שם לקוח: {name} {family}
        </h3>
        {/* Display customer address */}
        <p> כתובת לקוח: {address}</p>
      </div>
    </section>
  );
}
