require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
