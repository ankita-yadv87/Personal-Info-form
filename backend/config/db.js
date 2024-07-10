const mongoose = require("mongoose");
const dotenv = require("dotenv");

//config
dotenv.config({ path: "config/config.env" });
const config = process.env.MONGO_URI;

const db = config || "mongodb://localhost:27017/Candidate-Management";

const connectToDb = ()=>{
    try {
        mongoose
        .connect(db)
        .then(() => console.log("💻 Mondodb Connected"))
        .catch(err => console.error(err)); 
    } catch (error) {
       console.log("error=>",error) 
    }
}


  module.exports = connectToDb;