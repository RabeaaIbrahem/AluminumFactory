// const db = require("../../dbcon"); // Assuming dbcon handles database connection

// // Helper function to handle async queries
// const queryPromise = (sql, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.query(sql, params, (err, rows) => {
//       if (err) {
//         console.error("Query error:", err); // Log any errors for debugging
//         return reject(err); // Reject the promise with the error
//       }
//       resolve(rows); // Resolve the promise with the result
//     });
//   });
// };

// // Function to fetch all orders
// const getAllOrders = () => {
//   const sql = "SELECT * FROM `orders` ORDER BY orderNumber DESC"; // SQL query to select all orders
//   return queryPromise(sql); // Return a promise that resolves with the query result
// };

// // Function to create a new order
// const createOrder = (orderData) => {
//   const { orderNumber, profileType, count, customersId, supplierId,idQuotation , status } =
//     orderData; // Extract order details from the input object
//   const sql = `
//     INSERT INTO orders (orderNumber, profileType, count, customersId, supplierId,idQuotation , status) 
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `; // SQL query to insert a new order
//   return queryPromise(sql, [
//     orderNumber,
//     profileType,
//     count,
//     customersId,
//     supplierId,
//     idQuotation ,
//     status,
//   ]); // Return a promise that resolves when the order is inserted
// };

// // Function to get an order by orderNumber
// const getOrderById = async (orderNumber) => {
//   const query = "SELECT * FROM `orders` WHERE `orderNumber` = ?"; // SQL query to select an order by orderNumber
//   const [rows] = await db.query(query, [orderNumber]); // Execute the query and get the result
//   return rows[0]; // Return the first result (order) or undefined if not found
// };

// // Function to delete an order by orderNumber
// const deleteOrder = (orderNumber) => {
//   const sql = "DELETE FROM `orders` WHERE `orderNumber` = ?"; // SQL query to delete an order by orderNumber
//   return queryPromise(sql, [orderNumber]); // Return a promise that resolves when the order is deleted
// };

// // Function to update an order's status by orderNumber
// const updateOrderStatus = (orderNumber, status) => {
//   const sql = "UPDATE `orders` SET `status` = ? WHERE `orderNumber` = ?"; // SQL query to update the status of an order
//   return queryPromise(sql, [status, orderNumber]); // Return a promise that resolves when the order status is updated
// };

// // Function to fetch supplier orders count
// const getSupplierOrdersCount = () => {
//   const supplierOrdersQuery = `
//     SELECT supplierId, COUNT(supplierId) as orderCount 
//     FROM orders 
//     GROUP BY supplierId
//   `; // SQL query to count orders per supplier
//   return queryPromise(supplierOrdersQuery); // Return a promise that resolves with the supplier orders count
// };
// // Function to get foam window data for a specific customer
// async function getFoamWindowData(customerId) {
//   const query = `
//     SELECT 
//       fw.foamId, 
//       fw.quantity 
//     FROM 
//       foam_window fw
//     JOIN 
//       products p ON fw.idWindow = p.idWindow
//     JOIN 
//       orders o ON p.idProduct = o.productId
//     WHERE 
//       o.customersId = ?
//     LIMIT 0, 25;
//   `;

//   // Executing the query
//   return new Promise((resolve, reject) => {
//     db.query(query, [customerId], (err, result) => {
//       if (err) {
//         console.error("Error executing foam window query:", err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// }
// // Function to get foam door data for a specific customer
// async function getFoamDoorData(customerId) {
//   const query = `
//     SELECT 
//       fd.foamId, 
//       fd.quantity 
//     FROM 
//       foam_door fd
//     JOIN 
//       products p ON fd.idDoor = p.idDoor
//     JOIN 
//       orders o ON p.idProduct = o.productId
//     WHERE 
//       o.customersId = ?
//     LIMIT 0, 25;
//   `;

//   // Executing the query
//   return new Promise((resolve, reject) => {
//     db.query(query, [customerId], (err, result) => {
//       if (err) {
//         console.error("Error executing foam door query:", err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// }
// // Constants for calculations
// const profileDivisionFactor = 6.0;
// const calculateProfile = async (customerId) => {
//   const query = `
//     SELECT 
//       pr.id AS ProfileId,  
//       CONCAT(CEILING((p.width * 2 + p.height * 2) / ${profileDivisionFactor}), ' יחידות') AS RequiredProfiles,  -- Use 6 directly
//       CONCAT(CEILING((p.quantity * 2 + 2)), ' יחידות') AS ProfilesWithEmergency
//     FROM 
//       products p
//     JOIN 
//       profile pr ON p.profileType = pr.id
//     JOIN 
//       orders o ON p.idProduct = o.productId
//     WHERE 
//       o.customersId = ?  -- Filter by customer ID
//     GROUP BY 
//       pr.id;
//   `; // SQL query to calculate required profiles and profiles with emergency

//   return new Promise((resolve, reject) => {
//     db.query(query, [customerId], (err, rows) => {
//       if (err) {
//         console.error("Error calculating profiles:", err.message); // Log any errors
//         return reject(new Error("Failed to calculate profiles")); // Reject the promise with an error
//       }
//       resolve(rows); // Resolve with the calculation result
//     });
//   });
// };

// module.exports = {
//   getAllOrders,
//   createOrder,
//   deleteOrder,
//   updateOrderStatus,
//   getSupplierOrdersCount,
//   getOrderById,
//   getFoamWindowData,
//   getFoamDoorData,
//   calculateProfile,
// }; // Export functions for use in other modules
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
  const sql = "SELECT * FROM `order` ORDER BY idOrder DESC"; // SQL query to select all orders
  return queryPromise(sql); // Return a promise that resolves with the query result
};

// Function to create a new order
// const createOrder = (orderData) => {
//   const { supplierId, date, idQuotation, status } = orderData; // Extract order details from the input object
//   const sql = `
//     INSERT INTO order (supplierId, date, idQuotation, status) 
//     VALUES (?, ?, ?, ?)
//   `; // SQL query to insert a new order without the idOrder field

//   return queryPromise(sql, [
//     supplierId,
//     date,
//     idQuotation,
//     status,
//   ]); // Return a promise that resolves when the order is inserted
// };
const createOrder = async ({ date, supplierId, idQuotation, status }) => {
  try {
    const result = await db.query(
      'INSERT INTO `order` (date, supplierId, idQuotation, status) VALUES (?, ?, ?, ?)', 
      [date, supplierId, idQuotation, status]
    );

    return result;  // The result will contain insertId
  } catch (err) {
    throw new Error('Error saving order to database: ' + err.message);
  }
};
// Function to get an order by orderNumber
const getOrderById = async (orderNumber) => {
  const query = "SELECT * FROM `order` WHERE `idOrder` = ?"; // SQL query to select an order by orderNumber
  const [rows] = await db.query(query, [idOrder]); // Execute the query and get the result
  return rows[0]; // Return the first result (order) or undefined if not found
};
// Function to delete an order by orderNumber
const deleteOrder = (idOrder) => {
  const sql = "DELETE FROM `order` WHERE `idOrder` = ?"; // SQL query to delete an order by orderNumber
  return queryPromise(sql, [idOrder]); // Return a promise that resolves when the order is deleted
};
// Function to update an order's status by orderNumber
// Helper function to handle SQL queries with callbacks
const queryCallback = (sql, params = [], callback) => {
  db.query(sql, params, callback);
};
const updateOrder = async (idOrder, supplierId, formattedDate, quotationId) => {
  const query = `
    UPDATE \`order\` 
    SET supplierId = ?, date = ?, idQuotation = ? 
    WHERE idOrder = ?
  `;
  try {
    db.query(query, [supplierId, formattedDate, quotationId, idOrder], (err, result) => {
      if (err) {
        console.error("Error updating order:", err);
        throw err; // זרוק את השגיאה בחזרה
      }

      // בדוק אם היו שורות שהשתנו (affected rows)
      if (result.affectedRows > 0) {
        console.log("Order updated successfully.");
        return true;
      } else {
        console.log("No rows were updated.");
        return false;
      }
    });
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
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
async function getFoamWindowData(customerId) {
  const query = `
    SELECT 
      fw.foamId, 
      fw.quantity 
    FROM 
      foam_window fw
    JOIN 
      products p ON fw.idWindow = p.idWindow
    JOIN 
      orders o ON p.idProduct = o.productId
    WHERE 
      o.customersId = ?
    LIMIT 0, 25;
  `;

  // Executing the query
  return new Promise((resolve, reject) => {
    db.query(query, [customerId], (err, result) => {
      if (err) {
        console.error("Error executing foam window query:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
}
// Function to get foam door data for a specific customer
async function getFoamDoorData(customerId) {
  const query = `
    SELECT 
      fd.foamId, 
      fd.quantity 
    FROM 
      foam_door fd
    JOIN 
      products p ON fd.idDoor = p.idDoor
    JOIN 
      orders o ON p.idProduct = o.productId
    WHERE 
      o.customersId = ?
    LIMIT 0, 25;
  `;

  // Executing the query
  return new Promise((resolve, reject) => {
    db.query(query, [customerId], (err, result) => {
      if (err) {
        console.error("Error executing foam door query:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
}
// Constants for calculations
const profileDivisionFactor = 6.0;
const calculateProfile = async (customerId) => {
  const query = `
    SELECT 
      pr.id AS ProfileId,  
      CONCAT(CEILING((p.width * 2 + p.height * 2) / ${profileDivisionFactor}), ' יחידות') AS RequiredProfiles,  -- Use 6 directly
      CONCAT(CEILING((p.quantity * 2 + 2)), ' יחידות') AS ProfilesWithEmergency
    FROM 
      products p
    JOIN 
      profile pr ON p.profileType = pr.id
    JOIN 
      orders o ON p.idProduct = o.productId
    WHERE 
      o.customersId = ?  -- Filter by customer ID
    GROUP BY 
      pr.id;
  `; // SQL query to calculate required profiles and profiles with emergency

  return new Promise((resolve, reject) => {
    db.query(query, [customerId], (err, rows) => {
      if (err) {
        console.error("Error calculating profiles:", err.message); // Log any errors
        return reject(new Error("Failed to calculate profiles")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the calculation result
    });
  });
};

const getOrderByQuotation = async (quotationId) => {
  const query = 'SELECT * FROM `order` WHERE idQuotation = ? LIMIT 1';
  try {
    const result = await queryPromise(query, [quotationId]);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
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
