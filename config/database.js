const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
    })
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

module.exports = Database;
