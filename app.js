const express = require('express')
const cors = require("cors")

const app = express()
const port = 8080;
const routes = require('./src/routes/route');

var corsOptions = {
  origin: "http://localhost:3000"
};


app.use(cors(corsOptions));

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Remove 
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json()); // Remove
app.use(express.json());

require("./src/routes/route")(app);
// Handling Errors
app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// require("./app/routes/route")(app);

app.listen(port, () => {
  console.log(`hello Server is running on port ${port}.`);
});