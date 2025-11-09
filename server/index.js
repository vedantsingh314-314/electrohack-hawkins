// --- Import Packages ---
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- Load Environment Variables ---
dotenv.config();

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected! 🍃'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Middleware (optional placeholder) ---
// app.use(express.json());

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('Woohoo! The CampusPool API is live! 🚀');
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`⚡ Server is vibing on http://localhost:${PORT}`);
});
