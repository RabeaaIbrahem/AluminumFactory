const db = require("../../dbcon"); // Importing the database connection module

// Fetch all products
const getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM `products`"; // SQL query to select all products
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching products:", err.message); // Log any errors
        return reject(new Error("Failed to fetch products")); // Reject the promise with an error
      }
      resolve(data); // Resolve the promise with the data
    });
  });
};

// Fetch a product by ID
const getProductById = async (idProduct) => {
  const query = "SELECT * FROM `products` WHERE idProduct = ?"; // SQL query to select a product by its ID
  return new Promise((resolve, reject) => {
    db.query(query, [idProduct], (err, data) => {
      if (err) {
        console.error("Error fetching product:", err.message); // Log any errors
        return reject(new Error("Failed to fetch product")); // Reject the promise with an error
      }
      if (data.length === 0) {
        return reject(new Error("Product not found")); // Reject if no product is found
      }
      resolve(data[0]); // Resolve with the first result (the product)
    });
  });
};

// Create a new product
const createProduct = async (product) => {
  const {
    description,
    height,
    width,
    profileType,
    glassType,
    shutterType,
    pricePerUnit,
    quantity,
    idDoor,
    idWindow,
  } = product;

  const query = `
    INSERT INTO products 
    (description, height, width, profileType, glassType, shutterType, pricePerUnit, quantity, idDoor, idWindow)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `; // SQL query to insert a new product

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        description,
        height,
        width,
        profileType,
        glassType,
        shutterType,
        pricePerUnit,
        quantity,
        idDoor,
        idWindow,
      ],
      (error, results) => {
        if (error) {
          console.error("Error creating product:", error.message); // Log any errors
          reject(new Error("Failed to create product")); // Reject the promise with an error
        } else {
          resolve(results.insertId); // Resolve with the ID of the newly created product
        }
      }
    );
  });
};

// Update an existing product
const updateProduct = async (idProduct, product) => {
  const {
    description,
    height,
    width,
    quantity,
    pricePerUnit,
    profileType,
    glassType,
    shutterType,
    idDoor,
    idWindow,
  } = product;

  const query = `
    UPDATE \`products\` SET 
      description = ?, 
      profileType = ?,
      glassType = ?,
      shutterType = ?, 
      width = ?,
      height = ?,
      quantity = ?,
      pricePerUnit = ?,
      idDoor = ?,
      idWindow = ?
    WHERE idProduct = ?
  `; // SQL query to update an existing product

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        description,
        profileType,
        glassType,
        shutterType,
        width,
        height,
        quantity,
        pricePerUnit,
        idDoor,
        idWindow,
        idProduct,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating product:", err.message); // Log any errors
          return reject(new Error("Failed to update product")); // Reject the promise with an error
        }
        console.log("Update result:", result); // Log the result for debugging
        if (result.affectedRows === 0) {
          return reject(new Error("Product not found or no changes made")); // Reject if no rows were affected
        }
        resolve(result); // Resolve with the result of the update
      }
    );
  });
};

// Delete a product by idProduct
const deleteProduct = (idProduct) => {
  const query = "DELETE FROM `products` WHERE idProduct = ?"; // SQL query to delete a product by its ID
  return new Promise((resolve, reject) => {
    db.query(query, [idProduct], (err, result) => {
      if (err) {
        console.error("Error deleting product:", err.message); // Log any errors
        return reject(new Error("Failed to delete product")); // Reject the promise with an error
      }
      if (result.affectedRows === 0) {
        return reject(new Error("Product not found")); // Reject if no rows were affected
      }
      resolve("Product deleted successfully!"); // Resolve with a success message
    });
  });
};

// Save multiple items
const saveItems = async (items) => {
  const client = await db.connect(); // Connect to the database
  try {
    await client.query("BEGIN"); // Start a transaction
    for (const item of items) {
      const queryText = `
        INSERT INTO product (type, profileType, customersId, Remarks, width, length, count, price, numberBid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `; // SQL query to insert an item
      await client.query(queryText, [
        item.type,
        item.profileType,
        item.customersId,
        item.Remarks,
        item.width,
        item.length,
        item.count,
        item.price,
        item.numberBid,
      ]);
    }
    await client.query("COMMIT"); // Commit the transaction
    return "Items saved successfully!"; // Return a success message
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback the transaction in case of an error
    console.error("Error saving items:", error.message); // Log the error
    throw new Error("Failed to save items"); // Throw an error
  } finally {
    client.release(); // Release the database connection
  }
};

// Constants for calculations
const profileDivisionFactor = 600;
// Calculate required profiles and profiles with emergency
const calculateProfiles = async () => {
  const query = `
    SELECT 
      pr.id AS ProfileId,  
      CONCAT(CEILING((p.width * 2 + p.height * 2)*p.quantity / ${profileDivisionFactor}), ' יחידות') AS RequiredProfiles,
      CONCAT(CEILING((p.quantity * 2 + 2)), ' יחידות') AS ProfilesWithEmergency
    FROM 
      products p
    JOIN 
      profile pr ON p.profileType = pr.id
    GROUP BY pr.id ;
  `; // SQL query to calculate required profiles and profiles with emergency
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error calculating profiles:", err.message); // Log any errors
        return reject(new Error("Failed to calculate profiles")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the calculation result
    });
  });
};
// Get cutting plan based on profile dimensions
const getCuttingPlan = async () => {
  const query = `
    SELECT 
      p.profileType AS ProfileId,
      p.width AS Width,
      p.height AS Length,
      CASE 
        WHEN p.height <= ${profileDivisionFactor} THEN CONCAT('חתוך 2 חתיכות של ', p.height, ' מטרים מפרופיל אחד')
        ELSE CONCAT('אורך הפרופיל חורג מ-', ${profileDivisionFactor}, ' מטרים, נדרשת התמודדות מותאמת אישית')
      END AS LengthCutPlan,
      CASE 
        WHEN p.width <= ${profileDivisionFactor} THEN CONCAT('חתוך 2 חתיכות של ', p.width, ' מטרים מפרופיל אחד')
        ELSE CONCAT('רוחב הפרופיל חורג מ-', ${profileDivisionFactor}, ' מטרים, נדרשת התמודדות מותאמת אישית')
      END AS WidthCutPlan
    FROM 
      products p;
  `; // SQL query to get the cutting plan
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error getting cutting plan:", err.message); // Log any errors
        return reject(new Error("נכשל ביצירת תוכנית החיתוך")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the cutting plan
    });
  });
};

// Get profiles with associated windows and doors
const getProfilesWithAssociations = async () => {
  const query = `
   SELECT 
      p.profileType AS ProfileId,  
      w.WindowType AS WindowType,
      d.doorType AS DoorType
    FROM 
      products p
    LEFT JOIN 
      window w ON p.idWindow = w.idWindow  
    LEFT JOIN 
      door d ON p.idDoor = d.idDoor
      ORDER BY p.idProduct DESC; 
  `; // SQL query to get profiles with their associated windows and doors
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching profile associations:", err.message); // Log any errors
        return reject(new Error("Failed to fetch profile associations")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the profile associations
    });
  });
};

// Fetch foam data for windows
const getFoamWindowData = async () => {
  const query = `SELECT 
    fw.foamId, 
    fw.quantity, 
    f.foamType 
  FROM 
    foam_window fw
  JOIN 
    foam f ON f.foamId = fw.foamId;`; // SQL query to select foam data for windows
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching foam window data:", err.message); // Log any errors
        return reject(new Error("Failed to fetch foam window data")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the foam window data
    });
  });
};

// Fetch foam data for doors
const getFoamDoorData = async () => {
  const query = `SELECT fd.foamId, fd.quantity, f.foamType FROM foam_door fd JOIN foam f ON f.foamId = fd.foamId;`; // SQL query to select foam data for doors
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching foam door data:", err.message); // Log any errors
        return reject(new Error("Failed to fetch foam door data")); // Reject the promise with an error
      }
      resolve(rows); // Resolve with the foam door data
    });
  });
};
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  saveItems,
  calculateProfiles,
  getCuttingPlan,
  getProfilesWithAssociations,
  getFoamDoorData,
  getFoamWindowData,
}; // Exporting the functions for use in other modules
