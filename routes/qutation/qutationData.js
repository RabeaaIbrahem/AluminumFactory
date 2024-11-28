const db = require("../../dbcon"); // Assuming dbcon handles MySQL connection

// Helper function to handle SQL queries with promises
const queryPromise = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

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

// Function to check if a customer exists by ID
const checkCustomerExists = (idCustomer) => {
  const q = "SELECT * FROM `customers` WHERE `id` = ?";
  return queryPromise(q, [idCustomer]);
};

// Function to create a new quotation
const createQuotation = (quotationData) => {
  const { idCustomer, customerName, date, totalPrice, discount, vat, notes } =
    quotationData;
  const q =
    "INSERT INTO `quotations` (`idCustomer`, `customerName`, `date`, `totalPrice`, `discount`, `vat`, `notes`) VALUES (?, ?, ?, ?, ?,?, ?)";

  return queryPromise(q, [
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
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
  const { idCustomer, customerName, date, totalPrice, discount, vat, notes } =
    quotationData;

  const q =
    "UPDATE `quotations` SET `idCustomer` = ?, `customerName` = ?, `date` = ?, `totalPrice` = ?, `discount` = ?, `vat` = ?, `notes` = ? WHERE `idQuotation` = ?";

  return queryPromise(q, [
    idCustomer,
    customerName,
    date,
    totalPrice,
    discount,
    vat,
    notes,
    idQuotation, // Moved `idQuotation` to the end to match the query
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
const getQuotationsByCustomerId = async (idCustomer) => {
  console.log(`Querying database for customer ID: ${idCustomer}`); // Debug log
  const q = `SELECT * FROM quotations WHERE idCustomer = ? ORDER BY idQuotation DESC;`;
  const rows = await queryPromise(q, [idCustomer]);
  return rows;
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
};
