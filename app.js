const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;
// const port = 8081;

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://157.173.220.57:3000",
    "http://localhost:8000",
    "http://157.173.220.57:8000/",
  ],
};

app.use(cors(corsOptions));

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/src/files", express.static("src/files"));

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

app.listen(port, () => {
  console.log(`hello Server is running on port ${port}.`);
});
