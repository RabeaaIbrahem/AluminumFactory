import React from "react";
import styles from "./bidInfo.module.css";

// HeaderBid component displays the header section of a quotation with action buttons
export default function HeaderBid({
  idQuotation,
  handlePrint,
  handleSave,
  handleSend,
}) {
  return (
    // Header section for the bid (quotation) with title and action buttons
    <header className={styles.invoiceHeader}>
      <div className={styles.headerTitle}>
        {/* Display the quotation number in the title */}
        <h2>הצעת מחיר מספר {idQuotation} למוצרי אלומיניום</h2>
      </div>
      <div className={styles.headerButtons}>
        {/* Button to save the quotation */}
        <button onClick={handleSave}>שמירה</button>
        {/* Button to send the quotation */}
        <button onClick={handleSend}>שליחה</button>
        {/* Button to print the quotation */}
        <button onClick={handlePrint}>הדפסה</button>
      </div>
    </header>
  );
}
