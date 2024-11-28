import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./bidInfo.module.css";

// FactoryData component fetches and displays information about factories
export default function FactoryData() {
  const [factory, setFactory] = useState([]); // To store fetched factory data
  const [errors, setErrors] = useState({}); // To store error messages

  // useEffect hook to fetch factory data from the server when the component is mounted
  useEffect(() => {
    const fetchAllFactories = async () => {
      try {
        const res = await axios.get("/factory"); // Fetch factory data from the server
        setFactory(res.data); // Store the fetched data
      } catch (err) {
        setErrors({ fetch: "Failed to fetch factory data." }); // Set error if fetching fails
      }
    };
    fetchAllFactories(); // Call the function to fetch factory data
  }, []);

  // Map through the factory data and render each factory's details
  const factoryData = factory.map((el) => (
    <div key={el.id}>
      <footer className={styles.invoiceFooter}>
        {/* Display factory name */}
        <h1>{el.factoryName}</h1>
        {/* Display a description of what the factory produces */}
        <p>ייצור אלומיניום, מסגרות, שערים ומעקות, תריסים, רשתות, ויטרינות</p>
        <div>
          {/* Display factory contact details */}
          <p> {el.email}: מייל</p>
          <p>איש קשר: {el.contact}</p>
          <p>נייד: {el.phoneNumber}</p>
          <p>כתובת: {el.address}</p>
        </div>
      </footer>
    </div>
  ));

  // Return the factory data wrapped in a div
  return <div>{factoryData}</div>;
}
