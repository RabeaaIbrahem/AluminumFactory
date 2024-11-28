const express = require("express");
const cors = require("cors");
const login = require("./routes/Login/login"); //the login route path
const glass = require("./routes/Glass/glassService"); //the glass route  path
const door = require("./routes/Door/doorService");
const window = require("./routes/Window/windowService");
const shutter = require("./routes/Shutter/shutterService"); //the Shutter route  path
const quotationItems = require("./routes/quotationItems/qutationItemsService");
const profile = require("./routes/Profile/profileService"); //the  profile route path
const foam = require("./routes/Foam/foamService"); //the  profile route path
const supplier = require("./routes/Supplier/supplierService"); //the  supplier route path
const order = require("./routes/Order/orderService"); //the  order route path
const customer = require("./routes/Customer/customerService"); //the  customer route path
const product = require("./routes/Product/productService"); //the  customer route path
const factory = require("./routes/Factory/factoryService"); //the  factory route path
const search = require("./routes/search/search"); //the search route path
const searchFoam = require("./routes/search/searchFoam"); //the  foam search route path
const searchGlass = require("./routes/search/searchGlass"); //the glass search route path
const searchOrder = require("./routes/search/searchOrder"); //the glass search route path
const searchProduct = require("./routes/search/searchProduct"); //the glass search route path
const searchShutter = require("./routes/search/searchShutter"); //the glass search route path
const searchCustomers = require("./routes/search/searchCustomers"); //the glass search route path
const searchSuppliers = require("./routes/search/searchSupplier");
const qutation = require("./routes/qutation/qutationService");
const emailOrder = require("./routes/EmailSend/emailOrder");
const emailBid = require("./routes/EmailSend/emailBid");
const port = process.env.PORT || 3000;
// Creating an Express application
const app = express();

// Applying middleware for CORS support
app.use(cors());

// Applying middleware to parse incoming JSON requests
app.use(express.json());
app.use(quotationItems);
app.use(door);
app.use(window);
app.use(login); //using  the login router
app.use(glass); //using  the glass router
app.use(shutter); //using  the shutter router
app.use(profile); //using  the profile router
app.use(foam); //using  the foam router
app.use(supplier); //using  the supplier router
app.use(order); //using  the order router
app.use(customer); //using  the customer router
app.use(search); //using  the search router
app.use(product); //using  the product router
app.use(searchFoam); //using  the foam search router
app.use(searchGlass); //using  the glass search router
app.use(searchOrder); //using  the glass search router
app.use(searchProduct); //using the product search router
app.use(searchShutter);
app.use(searchCustomers); //using the customer search route
app.use(searchSuppliers); //using the supplier search route
app.use(factory); //using  the factory router
app.use(qutation); //using  the bid router
app.use(emailOrder); //using the email for the order router
app.use(emailBid); //using  the email for the bid router
// if url is not found:
app.use((req, res, next) => {
  res.status(404).send("<h1>Page not Found</h1>");
});

// Starting the server and listening on port 3000
app.listen(port, () => console.log(`Server is running on port ${port}`));
