const Pool = require('../models/Pool');
const User = require('../models/User');

// --- 1. CREATE A NEW POOL ---
exports.createPool = async (req, res) => {
  try {
    const { type, destination, meetUpPoint, time, poolMode } = req.body;
    const createdBy = req.user._id;

    let poolData = {
      type,
      destination,
      meetUpPoint,
      createdBy,
      members: [createdBy],
      poolMode: poolMode,
    };

    if (poolMode === 'now') {
      poolData.time = new Date(Date.now() + 10 * 60 * 1000); 
      poolData.expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    } else {
      poolData.time = time;
      poolData.expiresAt = new Date(new Date(time).getTime() + 5 * 60 * 1000);
    }

    const pool = await Pool.create(poolData);
    await User.findByIdAndUpdate(createdBy, { $inc: { ecoPoints: 10 } });

    res.status(201).json(pool);

  } catch (error) {
    console.error('--- CREATE POOL CRASHED ---');
    console.error('The "Pool.create()" command failed. This is the error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. GET ALL ACTIVE POOLS (Includes Lazy Cron Job) ---
exports.getAllActivePools = async (req, res) => {
  try {
    const now = new Date();
    
    // FIX: Only check pools that are currently 'Active' to prevent re-processing 'Finalized' ones.
    const expiredPools = await Pool.find({
      status: 'Active', 
      expiresAt: { $lt: now },
    });

    for (const pool of expiredPools) {
      if (pool.poolMode === 'now' && pool.members.length < 2) {
        pool.status = 'Expired';
        await pool.save();
      } 
      else if (pool.poolMode === 'later') {
        pool.status = 'Expired';
        await pool.save();
      }
    }

    // FIX: Fetch only 'Active' or 'Full' pools. 'Finalized' pools are now permanently hidden.
    const pools = await Pool.find({ 
      status: { $in: ['Active', 'Full'] }, 
      time: { $gte: now } 
    })
    .populate('createdBy', 'email')
    .populate('members', 'email')
    .sort({ time: 1 });

    res.status(200).json(pools);

  } catch (error) {
    console.error('GET ALL ACTIVE POOLS CRASHED:', error);
    res.status(500).json({ message: 'Server error' });
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
    
    if (pool.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already in this pool' });
    }

    if (pool.members.length >= pool.maxSize) {
      return res.status(400).json({ message: 'This pool is already full' });
    }
    
    if (pool.expiresAt && pool.expiresAt < new Date()) {
        return res.status(400).json({ message: 'The joining window for this pool has closed.' });
    }

    pool.members.push(userId);
    await User.findByIdAndUpdate(userId, { $inc: { ecoPoints: 5 } });

    if (pool.members.length === pool.maxSize) {
      pool.status = 'Full';
    }

    if (!pool.poolMode) {
      pool.poolMode = 'later';
    }

    await pool.save(); 
    
    const updatedPool = await Pool.findById(poolId)
      .populate('createdBy', 'email')
      .populate('members', 'email');

    res.status(200).json(updatedPool);

  } catch (error) {
    console.error('--- JOIN POOL CRASHED ---');
    console.error('The "pool.save()" command failed. This is the error:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. FINALIZE POOL & CALCULATE SPLIT COST ---
exports.finalizePool = async (req, res) => {
  try {
    const poolId = req.params.id;
    const { baseCost } = req.body; 

    const pool = await Pool.findById(poolId);

    if (!pool) {
      return res.status(404).json({ message: 'Pool not found.' });
    }

    if (pool.status !== 'Active' && pool.status !== 'Full') {
      return res.status(400).json({ message: 'Pool is already finalized or expired.' });
    }

    const memberCount = pool.members.length;
    
    if (!baseCost || memberCount === 0) {
        pool.status = 'Cancelled';
        await pool.save();
        return res.status(400).json({ message: 'Cannot finalize pool without a cost or members.' });
    }

    const splitAmount = baseCost / memberCount;

    pool.baseCost = baseCost;
    pool.splitCost = splitAmount;
    pool.status = 'Finalized'; 
    
    await pool.save();

    res.status(200).json({ 
        message: 'Pool finalized and costs calculated!', 
        pool: pool 
    });

  } catch (error) {
    console.error('FINALIZE POOL CRASHED:', error);
    res.status(500).json({ message: 'Server error during finalization.' });
  }
};