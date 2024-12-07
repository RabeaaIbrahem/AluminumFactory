const db = require("../../dbcon"); // Assuming dbcon handles database connection

// Helper function to handle async queries
const queryPromise = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.error("Query error:", err); // Log any errors for debugging
        return reject(err); // Reject the promise with the error
      }
      resolve(rows); // Resolve the promise with the result
    });
  });
};

// Function to fetch all orders
const getAllOrders = () => {
  const sql = "SELECT * FROM `order` ORDER BY idOrder DESC";
  return queryPromise(sql);
};

// Function to create a new order
const createOrder = async ({
  date,
  supplierId,
  idQuotation,
  status = "Pending",
}) => {
  try {
    const result = await db.query(
      "INSERT INTO `order` (date, supplierId, idQuotation, status) VALUES (?, ?, ?, ?)",
      [date, supplierId, idQuotation, status] // הגדרת סטטוס בברירת המחדל כ-Pending
    );
    return result; // התוצאה תכלול את insertId של ההזמנה החדשה
  } catch (err) {
    throw new Error("Error saving order to database: " + err.message);
  }
};

// Function to get an order by orderNumber
const getOrderById = async (idOrder) => {
  const query = "SELECT * FROM `order` WHERE `idOrder` = ?";
  try {
    const [rows] = await db.query(query, [idOrder]);
    return rows[0] || null; // מחזיר את ההזמנה עם כל הנתונים כולל סטטוס
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Function to delete an order by orderNumber
const deleteOrder = (idOrder) => {
  const sql = "DELETE FROM `order` WHERE `idOrder` = ?"; // SQL query to delete an order by orderNumber
  return queryPromise(sql, [idOrder]); // Return a promise that resolves when the order is deleted
};
// Function to update an order's status by orderNumber
const updateOrder = async (
  idOrder,
  supplierId,
  formattedDate,
  quotationId,
  status
) => {
  const query = `
    UPDATE \`order\` 
    SET supplierId = ?, date = ?, idQuotation = ?, status = ? 
    WHERE idOrder = ?
  `;
  try {
    db.query(
      query,
      [supplierId, formattedDate, quotationId, status, idOrder], // נוסיף את הסטטוס לעדכון
      (err, result) => {
        if (err) {
          console.error("Error updating order:", err);
          throw err; // זרוק את השגיאה במקרה של כשל
        }
        if (result.affectedRows > 0) {
          console.log("Order updated successfully.");
          return true;
        } else {
          console.log("No rows were updated.");
          return false;
        }
      }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Helper function to handle SQL queries with callbacks
const queryCallback = (sql, params = [], callback) => {
  db.query(sql, params, callback);
};

// Function to fetch supplier orders count
const getSupplierOrdersCount = () => {
  const supplierOrdersQuery = `
    SELECT supplierId, COUNT(supplierId) as orderCount 
    FROM orders 
    GROUP BY supplierId
  `; // SQL query to count orders per supplier
  return queryPromise(supplierOrdersQuery); // Return a promise that resolves with the supplier orders count
};
// Function to get foam window data for a specific customer
async function getFoamWindowData(idQuotation) {
  const query = `
    SELECT 
  fw.foamId, 
  fw.quantity,
  f.foamType  -- foamType from the foam table
FROM 
  foam_window fw
JOIN 
  products p ON fw.idWindow = p.idWindow
JOIN 
  quotationitems1 o ON p.idProduct = o.idProduct
JOIN
  foam f ON fw.foamId = f.foamId  -- Join with the foam table to get foamType
WHERE 
  o.idQuotation = ?
LIMIT 0, 25;
  `;
  // Executing the query
  return new Promise((resolve, reject) => {
    db.query(query, [idQuotation], (err, result) => {
      if (err) {
        console.error("Error executing foam window query:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
}
// Function to get foam door data for a specific customer
async function getFoamDoorData(idQuotation) {
  const query = `
   SELECT 
  fd.foamId, 
  fd.quantity,
  f.foamType  -- Add foamType from the foam table
FROM 
  foam_door fd
JOIN 
  products p ON fd.idDoor = p.idDoor
JOIN 
  quotationitems1 o ON p.idProduct = o.idProduct
JOIN
  foam f ON fd.foamId = f.foamId  -- Join with the foam table to get foamType
WHERE 
  o.idQuotation = ?
LIMIT 0, 25;

  `;
  // Executing the query
  return new Promise((resolve, reject) => {
    db.query(query, [idQuotation], (err, result) => {
      if (err) {
        console.error("Error executing foam door query:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
}
// Constants for calculations
const profileDivisionFactor = 600;
const calculateProfile = async (idQuotation) => {
  const query = `
    SELECT 
      pr.id AS ProfileId,  
      CONCAT(CEILING((p.width * 2 + p.height * 2)*p.quantity  / ${profileDivisionFactor}), ' יחידות')AS RequiredProfiles,  
      CONCAT(CEILING((p.quantity * 2 + 2)), ' יחידות') AS ProfilesWithEmergency
    FROM 
      products p
    JOIN 
      profile pr ON p.profileType = pr.id
    JOIN 
      quotationitems1 o ON p.idProduct = o.idProduct
    WHERE 
      o.idQuotation = ?  -- Filter by customer ID
    GROUP BY 
      pr.id;
  `; // SQL query to calculate required profiles and profiles with emergency

  return new Promise((resolve, reject) => {
    db.query(query, [idQuotation], (err, rows) => {
      if (err) {
        console.error("Error calculating profiles:", err.message); // Log any errors
        return reject(new Error("Failed to calculate profiles")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the calculation result
    });
  });
};

const getOrderByQuotation = async (idQuotation) => {
  const query = "SELECT * FROM `order` WHERE idQuotation = ? LIMIT 1";
  try {
    const result = await queryPromise(query, [idQuotation]);
    return result[0] || null; // Return null if no order is found
  } catch (error) {
    console.error("Error fetching order:", error);
    return null; // Gracefully handle the error and return null
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  getOrderByQuotation,
  getSupplierOrdersCount,
  getOrderById,
  getFoamWindowData,
  getFoamDoorData,
  calculateProfile,
}; // Export functions for use in other modules
