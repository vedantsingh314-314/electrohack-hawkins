const Pool = require('../models/pool');
const User = require('../models/user');

// --- 1. CREATE A NEW POOL ---
// --- 1. CREATE A NEW POOL (DEBUG MODE) ---
exports.createPool = async (req, res) => {
  try {
    console.log('[CREATE POOL] Received request body:', req.body);
    
    // 'poolMode' will be 'now' or 'later'
    const { type, destination, meetUpPoint, time, poolMode } = req.body;
    const createdBy = req.user._id;

    let poolData = {
      type,
      destination,
      meetUpPoint,
      createdBy,
      members: [createdBy],
      poolMode: poolMode, // We save the mode
    };

    if (poolMode === 'now') {
      console.log('[CREATE POOL] Mode is "now". Setting times...');
      poolData.time = new Date(Date.now() + 10 * 60 * 1000); // Ride in 10 mins
      poolData.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Joining window is 5 mins
    } else {
      console.log('[CREATE POOL] Mode is "later". Setting times...');
      poolData.time = time;
      // Joining window is valid until 5 mins AFTER the scheduled ride
      poolData.expiresAt = new Date(new Date(time).getTime() + 5 * 60 * 1000);
    }
    
    console.log('[CREATE POOL] Creating pool in database with this data:', poolData);
    const pool = await Pool.create(poolData);
    console.log('[CREATE POOL] Pool created successfully!');

    // Give the creator 10 eco-points
    await User.findByIdAndUpdate(createdBy, { $inc: { ecoPoints: 10 } });
    console.log('[CREATE POOL] Eco-points updated!');

    res.status(201).json(pool);

  } catch (error) {
    // --- THIS IS THE IMPORTANT PART ---
    console.error('--- CREATE POOL CRASHED ---');
    console.error('The "Pool.create()" command failed. This is the error:');
    console.error(error); 
    // --- END ---
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. GET ALL ACTIVE POOLS ---
exports.getAllActivePools = async (req, res) => {
  try {
    const now = new Date();
    
    // --- START OF THE "LAZY CRON JOB" ---
    const expiredPools = await Pool.find({
      status: 'Active',
      expiresAt: { $lt: now },
    });

    for (const pool of expiredPools) {
      if (pool.poolMode === 'now' && pool.members.length < 2) {
        pool.status = 'Expired';
        await pool.save();
      } else if (pool.poolMode === 'later') {
        pool.status = 'Expired';
        await pool.save();
      }
    }
    // --- END OF THE "LAZY CRON JOB" ---

    const pools = await Pool.find({ 
      status: 'Active',
      time: { $gte: now } 
    })
    .populate('createdBy', 'email')
    .populate('members', 'email')
    .sort({ time: 1 });

    res.status(200).json(pools);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. JOIN AN EXISTING POOL (FINAL FIXED VERSION) ---
exports.joinPool = async (req, res) => {
  try {
    const poolId = req.params.id;
    const userId = req.user._id;

    const pool = await Pool.findById(poolId);

    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }

    if (pool.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already in this pool' });
    }

    if (pool.members.length >= pool.maxSize) {
      return res.status(400).json({ message: 'This pool is already full' });
    }

    // Add the user to the pool
    pool.members.push(userId);

    // Give the joiner 5 eco-points
    await User.findByIdAndUpdate(userId, { $inc: { ecoPoints: 5 } });

    // Update status if full
    if (pool.members.length === pool.maxSize) {
      pool.status = 'Full';
    }

    // --- THIS IS THE FIX ---
    // If the pool is old and doesn't have a poolMode, set a default
    if (!pool.poolMode) {
      pool.poolMode = 'later';
    }
    // --- END OF FIX ---

    // Save the pool
    await pool.save(); // This will NOW work
    
    const updatedPool = await Pool.findById(poolId)
      .populate('createdBy', 'email')
      .populate('members', 'email');

    res.status(200).json(updatedPool);

  } catch (error) {
    // This is our advanced error logger
    console.error('--- JOIN POOL CRASHED ---');
    console.error('The "pool.save()" command failed. This is the error:');
    console.error(error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};