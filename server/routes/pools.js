const express = require('express');
const router = express.Router();
const { createPool, getAllActivePools, joinPool, finalizePool } = require('../controllers/poolcontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPool);
router.get('/', protect, getAllActivePools);
router.put('/join/:id', protect, joinPool);
router.put('/finalize/:id', protect, finalizePool);

module.exports = router;
