import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import styles from "./orders.module.css"; // ייבוא CSS Modules
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import editIcon from "../../../img/icon/edit.png";
import saveIcon from "../../../img/icon/save.png";
import closeIcon from "../../../img/icon/close.png";
const Invoice = () => {
  const [factory, setFactory] = useState([]); // אתחול למערך ריק
  const [errors, setErrors] = useState(""); // לשמור הודעת שגיאה אם יש
  const [items, setItems] = useState([
    { id: 1, macat: "1862", description: "אטם שחור למסילה עליונה", typeColor: "", quantity: 1 },
    { id: 2, macat: "1861", description: "אטם פרופיל כולל מבולבים", typeColor: "", quantity: 1 }
  ]);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchAllFactories = async () => {
      try {
        const res = await axios.get("/factory"); // בקשת נתונים מהשרת
        setFactory(res.data || []); // שמירת הנתונים
      } catch (err) {
        setErrors("שגיאה בטעינת הנתונים."); // טיפול בשגיאה
      }
    };
    fetchAllFactories();
  }, []);
  if (errors) {
    return <p>{errors}</p>; // הצגת שגיאה אם יש
  }
  const handleItemChange = (e, field, id) => {
    const value = e.target.value;
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const handleSave = async () => {
    try {
      document.querySelectorAll(".submit-btn, button").forEach((button) => (button.style.display = "none"));
      const invoiceElement = invoiceRef.current;
      if (!invoiceElement) {
        console.error("Error: No element with ref 'invoice-container' found.");
        alert("Invoice element not found!");
        return;
      }

      const canvas = await html2canvas(invoiceElement, { scale: 1 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`הזמנת חומר${64}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      document.querySelectorAll(".submit-btn, button").forEach((button) => (button.style.display = ""));
    }
  };
  const handleSend = async () => {
    try {
      document.querySelectorAll(".submit-btn, button").forEach((button) => (button.style.display = "none"));
      const invoiceElement = invoiceRef.current;
      const canvas = await html2canvas(invoiceElement, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = doc.output("blob");
      const emailData = new FormData();
      emailData.append("pdf", pdfBlob, `הזמנת חומר${62}.pdf`);
      emailData.append("email", "ri442000@gmail.com");

      const response = await axios.post("/send-bid-email", emailData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response from server:", response.data);
      alert("Bid details sent successfully");
    } catch (error) {
      console.error("Error sending bid email:", error);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
      alert("Error sending bid details");
    } finally {
      document.querySelectorAll(".submit-btn, button").forEach((button) => (button.style.display = ""));
    }
  };
  const handlePrint = () => {
    window.print();
  };

    const handleDeleteProduct = async (index) => {
  };
  return (
    <div className={styles.invoice} ref={invoiceRef}>
      <header>
        <div className={styles.headerButtons}>
          <button onClick={handleSave}>שמירה</button>
          <button onClick={handleSend}>שליחה</button>
          <button onClick={handlePrint}>הדפסה</button>
        </div>
        {factory.map((el) => (
          <div key={el.id} className={styles["header-details"]}>
            <h1>{el.factoryName}</h1>
            <p>ייצור אלומיניום, מסגרות, שערים ומעקות, תריסים, רשתות, ויטרינות</p>
            <p>
              {el.email} | טלפון: {el.phoneNumber} | {el.address}
            </p>
          </div>
        ))}
      </header>

      <section className={styles.info}>
        <div className={styles.row}>
          <span>לכבוד: אור אלום בע"מ</span>
          <span>כתובת: מפעל רמת</span>
          <span>תאריך: 10/06/2017</span>
        </div>
        <div>
          <p className={styles.orderText}>
            הזמנת חומר מס': <span>62</span>
          </p>
        </div>
        <div>
          <p>מס' פרויקט: 354</p>
        </div>
      </section>

      <table>
        <thead>
          <tr>
            <th>מקט</th>
            <th> הפריט</th>
            <th> תיאור</th>
            <th>כמות</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.macat}</td>
              <td>{item.description}</td>
              <td>
                <input
                  type="text"
                  value={item.typeColor}
                  onChange={(e) => handleItemChange(e, "typeColor", item.id)}
                  placeholder="הכנס סוג + צבע"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, "quantity", item.id)}
                  min="1"
                />
              </td>
              <td>
                 <img
                  src={editIcon}
                  alt="edit"
                   onClick={() => handleDeleteProduct()}
                  className={styles.iconAction}
                />
                  <img
                    src={saveIcon}
                    alt="Save"
                    className={styles.icon}
                    onClick={handleDeleteProduct}
                  />
                  <img
                    src={closeIcon}
                    alt="Cancel"
                    className={styles.icon}
                    onClick={handleDeleteProduct}
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer>
        <p>
          בכבוד רב,
          {factory.map((el) => (
            <div key={el.id}>{el.factoryName}</div>
          ))}
        </p>
      </footer>
    </div>
  );
};

export default Invoice;
