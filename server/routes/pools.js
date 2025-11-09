const express = require('express');
const router = express.Router();
const { createPool, getAllActivePools, joinPool } = require('../controllers/poolcontroller');
const { protect } = require('../middleware/authmiddleware');

// POST   /api/pools/      (Create a new pool)
router.post('/', protect, createPool);

// GET    /api/pools/      (Get all active pools)
router.get('/', protect, getAllActivePools);

// PUT    /api/pools/join/:id  (Join a pool)
router.put('/join/:id', protect, joinPool);

module.exports = router;