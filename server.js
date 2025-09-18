const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const { errorHandler } = require('./middlewares/errorHandler');


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json()); // body parser


// Connect DB
connectDB();


// Routes
app.use('/api/products', productRoutes);


// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});