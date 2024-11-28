import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "../dashborad/dashBoard.module.css"; // Import the CSS module for styling

// Register chart components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [orderData, setOrderData] = useState([]); // All fetched data
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders based on date range
  const [randomOrders, setRandomOrders] = useState([]); // Randomly selected orders
  const [fromDate, setFromDate] = useState(""); // Start date filter
  const [toDate, setToDate] = useState(""); // End date filter
  const [numOrders, setNumOrders] = useState(3); // Number of random orders to display

  // Fetch order data on component mount
  useEffect(() => {
    axios
      .get("/orderCust") // Fetch order data from API
      .then((response) => {
        console.log("Fetched order data:", response.data);
        setOrderData(response.data);
        setFilteredOrders(response.data); // Initialize filtered orders
        selectRandomOrders(response.data, numOrders); // Initialize random orders
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, []);
  useEffect(() => {
    if (fromDate && toDate) {
      const filtered = orderData.filter((order) => {
        const orderDate = new Date(order.fromDate);
        return orderDate >= new Date(fromDate) && orderDate <= new Date(toDate);
      });

      if (filtered.length === 0) {
        alert("לא נמצאו הזמנות בטווח התאריכים שבחרת.");
      }

      setFilteredOrders(filtered); // Update filtered orders
      selectRandomOrders(filtered, numOrders); // Update random orders based on filtered data
    } else {
      setFilteredOrders(orderData); // Reset to all data if no filters
      selectRandomOrders(orderData, numOrders); // Reset random orders
    }
  }, [fromDate, toDate, numOrders, orderData]);

  // Filter orders by date range whenever fromDate or toDate changes
  useEffect(() => {
    if (fromDate && toDate) {
      const filtered = orderData.filter((order) => {
        const orderDate = new Date(order.fromDate);
        return orderDate >= new Date(fromDate) && orderDate <= new Date(toDate);
      });
      setFilteredOrders(filtered); // Update filtered orders
      selectRandomOrders(filtered, numOrders); // Update random orders based on filtered data
    } else {
      setFilteredOrders(orderData); // Reset to all data if no filters
      selectRandomOrders(orderData, numOrders); // Reset random orders
    }
  }, [fromDate, toDate, numOrders, orderData]);

  // Select a specific number of random orders
  const selectRandomOrders = (data, count) => {
    if (data.length <= count) {
      setRandomOrders(data); // If fewer orders than count, use all of them
      return;
    }
    const shuffled = [...data].sort(() => 0.5 - Math.random()); // Shuffle the array
    setRandomOrders(shuffled.slice(0, count)); // Select the first `count` items
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const handleToDateChange = (e) => {
    const selectedToDate = e.target.value;

    // Check if `fromDate` is not selected
    if (!fromDate) {
      alert("יש לבחור תאריך התחלה לפני בחירת תאריך סיום.");
      return; // Prevent further execution
    }

    // Check if `toDate` is earlier than `fromDate`
    if (new Date(selectedToDate) <= new Date(fromDate)) {
      alert("תאריך סיום חייב להיות גדול מתאריך התחלה לפחות ביום אחד.");
      return; // Prevent further execution
    }

    setToDate(selectedToDate); // Update `toDate` if valid
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>סקירת הזמנות</h1>

      {/* Date Filters and Combo Box */}
      <div className={styles.filters}>
        <label>
          תאריך התחלה:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={styles.dateInput}
          />
        </label>
        <label>
          תאריך סיום:
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange} // Use the custom handler
            className={styles.dateInput}
            min={
              fromDate
                ? new Date(new Date(fromDate).getTime() + 86400000)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
          />
        </label>
        <label>
          הצגת הזמנות:
          <select
            value={numOrders}
            onChange={(e) => setNumOrders(parseInt(e.target.value))}
            className={styles.selectInput}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={15}>כל ההזמנות</option>
          </select>
        </label>
      </div>

      {/* Bar Chart */}
      <div className={styles.chartContainer}>
        <h2 className={styles.h2}>הזמנת לקוח</h2>
        <div className={styles.chartWrapper}>
          <Bar
            className={styles.bar}
            data={{
              labels: randomOrders.map(
                (order) => `${order.month} - ת.ז של לקוח ${order.idCustomer}`
              ),
              datasets: [
                {
                  label: "מחיר כולל",
                  data: randomOrders.map((order) => order.totalPrice),
                  backgroundColor: randomOrders.map(() => getRandomColor()),
                  barThickness: 150,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const order = randomOrders[tooltipItem.dataIndex];
                      return `תאריך התחלה: ${new Date(
                        order.fromDate
                      ).toLocaleDateString()} \n
                      תאריך סיום: ${new Date(
                        order.toDate
                      ).toLocaleDateString()} \n
                      מחיר כולל: ${order.totalPrice}, מס' הצעת מחיר: ${
                        order.quotationCount
                      }`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
