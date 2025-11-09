// ---------------------------
// Import Packages
// ---------------------------
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Enables frontend/backend communication

// Load environment variables from .env file
dotenv.config();

// ---------------------------
// Import Routes
// ---------------------------
const authRoutes = require('./routes/auth');
const poolRoutes = require('./routes/pools');

// ---------------------------
// Create Express App
// ---------------------------
const app = express();

// ---------------------------
// Middlewares
// ---------------------------
app.use(cors()); // Fixes CORS policy issues
app.use(express.json()); // Parse JSON bodies

// ---------------------------
// Database Connection
// ---------------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected! 🍃'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ---------------------------
// Test Route
// ---------------------------
app.get('/', (req, res) => {
  res.send('Woohoo! The CampusPool API is live! 🚀');
});

// ---------------------------
// API Routes
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);

// ---------------------------
// Start the Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`⚡ Server is vibing on http://localhost:${PORT}`);
});
