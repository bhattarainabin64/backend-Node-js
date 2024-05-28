const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const Database = require('./config/database'); 
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");


dotenv.config();

Database.getInstance();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 6000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
