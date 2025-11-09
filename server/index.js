// --- Import Packages ---
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Load Environment Variables ---
dotenv.config();

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const poolRoutes = require('./routes/pools');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected! 🍃'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('Woohoo! The CampusPool API is live! 🚀');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`⚡ Server is vibing on http://localhost:${PORT}`);
});
