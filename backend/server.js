const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");
const cloudinary = require("cloudinary");

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//config
dotenv.config({ path: "config/config.env" });

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT;

const server = app.listen(port, () => { console.log(`Server running on port ${port} 🔥`) });

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log("error=>",err)
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    server.close(() => {
        process.exit(1);
    })
});


