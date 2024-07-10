const express = require("express");
const app  = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
// Allow all origins for now (you can restrict it to your frontend later)
app.use(cors());

// Route Imports
const candidate = require("./routes/candidateRoute");

app.use("/api/v1",candidate);

//middleware for error
app.use(errorMiddleware);

module.exports=app;