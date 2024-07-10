const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDatabase();

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


