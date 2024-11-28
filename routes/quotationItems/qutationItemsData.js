const db = require("../../dbcon"); // Assuming this is your database connection

const queryPromise = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

// Function to get a quotation and its items by idQuotation
const getQuotationById = async (idQuotation) => {
  const query = `
    SELECT q.*, qi.idItem, qi.idProduct, qi.quantity, qi.totalPrice
    FROM quotations q
    JOIN quotationitems1 qi ON q.idQuotation = qi.idQuotation
    WHERE q.idQuotation = ?;
  `;
  const rows = await queryPromise(query, [idQuotation]);
  return rows;
};
// Function to delete a quotation item by idItem
const deleteQuotationItemById = (idItem) => {
  const query = "DELETE FROM quotationitems1 WHERE idItem = ?";

  return new Promise((resolve, reject) => {
    db.query(query, [idItem], (err, result) => {
      if (err) {
        console.error("Error deleting quotation item:", err.message);
        return reject(new Error("Failed to delete quotation item"));
      }

      resolve(result);
    });
  });
};

const createQuotationItem = async (quotationItem) => {
  const { idQuotation, idProduct, quantity, totalPrice } = quotationItem;

  // SQL query to insert the new quotation item
  const query =
    "INSERT INTO `quotationitems1` (`idQuotation`, `idProduct`, `quantity`, `totalPrice`) VALUES (?, ?, ?, ?)";

  return new Promise((resolve, reject) => {
    // Execute the query and return the last inserted id
    db.query(
      query,
      [idQuotation, idProduct, quantity, totalPrice],
      (err, result) => {
        if (err) {
          console.error("Database query error:", err.message);
          return reject(err); // Return the error to the caller
        }

        // Return the newly created idItem using result.insertId
        console.log("New item created with idItem:", result.insertId);
        resolve(result.insertId); // Return the new idItem for future updates
      }
    );
  });
};

const updateQuotationItemById = async (idItem, quotationItem) => {
  const { idQuotation, idProduct, quantity, totalPrice } = quotationItem;

  const query =
    "UPDATE `quotationitems1` SET `idQuotation` = ?, `idProduct` = ?, `quantity` = ?, `totalPrice` = ? WHERE `idItem` = ?";

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [idQuotation, idProduct, quantity, totalPrice, idItem],
      (err, result) => {
        if (err) {
          console.error("Error updating quotation item:", err.message);
          return reject(err); // Handle error
        }

        console.log("Updated item with idItem:", idItem);
        resolve(result); // Indicate success
      }
    );
  });
};
module.exports = {
  getQuotationById,
  createQuotationItem,
  deleteQuotationItemById,
  updateQuotationItemById,
};
