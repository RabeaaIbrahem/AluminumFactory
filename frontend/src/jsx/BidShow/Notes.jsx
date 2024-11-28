import React from "react";
import styles from "./bidInfo.module.css";

// Notes component displays customer notes if available
export default function Notes({ notes }) {
  return (
    // Section to display notes related to the invoice
    <section className={styles.invoiceNotes}>
      {/* Check if there are any notes to display, otherwise show nothing */}
      {notes ? <p> הערות ללקוח: {notes}</p> : ""}
    </section>
  );
}
