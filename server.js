const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware file setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.error("MongoDB connection error ❌", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
