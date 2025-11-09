const Pool = require('../models/pool');
const User = require('../models/user');

// --- 1. CREATE A NEW POOL ---
exports.createPool = async (req, res) => {
  try {
    const { type, destination, meetUpPoint, time } = req.body;

    // req.user comes from our "protect" middleware
    const createdBy = req.user._id;

    const pool = await Pool.create({
      type,
      destination,
      meetUpPoint,
      time,
      createdBy,
      members: [createdBy], // The creator is the first member
    });

    // --- GAMIFIED ECO-REWARDS ---
    // Give the creator 10 eco-points for starting a pool
    await User.findByIdAndUpdate(createdBy, { $inc: { ecoPoints: 10 } });

    res.status(201).json(pool);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. GET ALL ACTIVE POOLS ---
exports.getAllActivePools = async (req, res) => {
  try {
    // Find pools that are "Active" and whose 'time' is in the future
    const pools = await Pool.find({ 
      status: 'Active',
      time: { $gte: new Date() } // $gte means "greater than or equal to"
    })
    .populate('createdBy', 'email') // Show the creator's email
    .populate('members', 'email')   // Show the members' emails
    .sort({ time: 1 }); // Show the soonest ones first

    res.status(200).json(pools);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. JOIN AN EXISTING POOL ---
exports.joinPool = async (req, res) => {
  try {
    const poolId = req.params.id;
    const userId = req.user._id;

    const pool = await Pool.findById(poolId);

    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }

    // Check if user is already in the pool
    if (pool.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already in this pool' });
    }

    // Check if pool is full
    if (pool.members.length >= pool.maxSize) {
      return res.status(400).json({ message: 'This pool is already full' });
    }

    // Add the user to the pool
    pool.members.push(userId);

    // --- GAMIFIED ECO-REWARDS ---
    // Give the joiner 5 eco-points
    await User.findByIdAndUpdate(userId, { $inc: { ecoPoints: 5 } });

    // If the pool is now full, update its status
    if (pool.members.length === pool.maxSize) {
      pool.status = 'Full';
    }

    await pool.save();

    // Repopulate the pool to send back the full details
    const updatedPool = await Pool.findById(poolId)
      .populate('createdBy', 'email')
      .populate('members', 'email');

    res.status(200).json(updatedPool);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};