const db = require("../../dbcon"); // Assuming dbcon handles MySQL connection

// Helper function to handle SQL queries with promises
const queryPromise = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

// Function to fetch quotation by ID
const getQuotationById = (idQuotation) => {
  const query = "SELECT * FROM `quotations` WHERE idQuotation = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idQuotation], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Function to fetch all quotations
const getAllQuotations = () => {
  const q = "SELECT * FROM `quotations` ORDER BY idQuotation DESC";
  return queryPromise(q);
};
// Function to update the quotation status in the database
const updateQuotationStatusById = async (idQuotation, status) => {
  const query = "UPDATE `quotations` SET `status` = ? WHERE `idQuotation` = ?";
  console.log(status, "gf");
  try {
    console.log(
      `Executing query: ${query} with values [${status}, ${idQuotation}]`
    );
    const result = await db.query(query, [status, idQuotation]);
    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error updating quotation status");
  }
};

// Function to check if a customer exists by ID
const checkCustomerExists = (idCustomer) => {
  const q = "SELECT * FROM `customers` WHERE `id` = ?";
  return queryPromise(q, [idCustomer]);
};

// Function to create a new quotation
const createQuotation = (quotationData) => {
  const {
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
    status,
  } = quotationData;
  const q =
    "INSERT INTO `quotations` (`idCustomer`, `customerName`, `date`, `totalPrice`, `discount`, `vat`, `notes`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  return queryPromise(q, [
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
    status, // Added status field
  ])
    .then((result) => {
      return { idQuotation: result.insertId }; // Return the new quotation ID
    })
    .catch((err) => {
      throw new Error("Failed to create quotation");
    });
};

// Function to delete a quotation by quotation ID
const deleteQuotationById = (idQuotation) => {
  const q = "DELETE FROM `quotations` WHERE `idQuotation` = ?";
  return queryPromise(q, [idQuotation]);
};

// Function to update a quotation by quotation ID
const updateQuotationById = (idQuotation, quotationData) => {
  const {
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
    status,
  } = quotationData;

  const q =
    "UPDATE `quotations` SET `idCustomer` = ?, `customerName` = ?, `date` = ?, `totalPrice` = ?, `discount` = ?, `vat` = ?, `notes` = ?, `status` = ? WHERE `idQuotation` = ?";

  return queryPromise(q, [
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
    status, // Update status field
    idQuotation, // Added idQuotation to the end to match query
  ]);
};

// Function to fetch all orders (quotations)
const getAllOrders = () => {
  const q = "SELECT * FROM `quotations`";
  return queryPromise(q);
};

// Function to fetch quotation counts grouped by customer ID
const getQuotationCounts = () => {
  const q =
    "SELECT `idCustomer`, COUNT(`idCustomer`) as quotationCount FROM `quotations` GROUP BY `idCustomer`";
  return queryPromise(q);
};

// Function to get quotations within a date range and group by month
const getQuotationDetailsByDateRange = () => {
  const query = `
    SELECT idCustomer, 
           SUM(totalPrice) as totalPrice, 
           DATE_FORMAT(date, '%Y-%m') as month, 
           COUNT(*) as quotationCount,
           date as fromDate, 
           DATE_ADD(date, INTERVAL 1 MONTH) as toDate
    FROM quotations
    GROUP BY idCustomer, month
    ORDER BY month, idCustomer;
  `;

  return queryPromise(query);
};

// Function to get quotations by customer ID
const getQuotationsByCustomerId = async (idCustomer) => {
  console.log(`Querying database for customer ID: ${idCustomer}`); // Debug log
  const q = `SELECT * FROM quotations WHERE idCustomer = ? ORDER BY idQuotation DESC;`;
  const rows = await queryPromise(q, [idCustomer]);
  return rows;
};
// Function to get quotations by date range and status
const getQuotationsByDateRangeAndStatus = (fromDate, toDate, status) => {
  const query = `
    SELECT idCustomer, 
           SUM(totalPrice) as totalPrice, 
           DATE_FORMAT(date, '%Y-%m') as month, 
           COUNT(*) as quotationCount,
           date as fromDate, 
           DATE_ADD(date, INTERVAL 1 MONTH) as toDate
    FROM quotations
    WHERE date BETWEEN ? AND ? AND status = ?
    GROUP BY idCustomer, month
    ORDER BY month, idCustomer;
  `;
  return queryPromise(query, [fromDate, toDate, status]);
};

module.exports = {
  getAllQuotations,
  checkCustomerExists,
  createQuotation,
  deleteQuotationById,
  updateQuotationById,
  getAllOrders,
  getQuotationCounts,
  getQuotationDetailsByDateRange,
  getQuotationById,
  getQuotationsByCustomerId,
  updateQuotationStatusById,
  getQuotationsByDateRangeAndStatus,
};
