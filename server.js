const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
const path = require("path"); // Add this line if not already included
require("dotenv").config();

const initRouter = require("./routes");

// Connect to MongoDB
mongoose    
  .connect(
    process.env.MONGO_URL
  )
  .then(() => console.log("Connected successfully to DB"))
  .catch((err) => console.error(err));

// Create an Express application, set port for server
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passportConfig.initialize());
app.use(cors());

// Serve static files
app.use("/sign-up", express.static(path.join(__dirname, "public/profile"))); // This line serves files in the profile folder

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));

// // Handle React routing, return index.html for all requests
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

initRouter(app);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);  
});
