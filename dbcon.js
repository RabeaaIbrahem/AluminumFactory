const mysql = require("mysql"); // Import the mysql module

// Establishing a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",      // The hostname of the MySQL server
  user: "root",           // The MySQL username
  password: "",           // The password for the MySQL user
  database: "aluminumfactory" // The name of the database to connect to
});

// Export the database connection to be used in other modules
module.exports = db;
