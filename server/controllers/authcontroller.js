const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper function to create a token ---
const createToken = (id) => {
  // We'll create a .env variable for this secret later, for now this is fine
 return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
  
};

// --- 1. REGISTER A NEW USER ---
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. The campus-only check
    // Replace this with your college's real email domain
    const COLLEGE_DOMAIN = 'nitjsr.ac.in';
    let isVerified = false;

    if (email.endsWith(COLLEGE_DOMAIN)) {
      isVerified = true;
    }

    if (!isVerified) {
      // You can decide to block them or just let them be unverified
      return res.status(400).json({ message: 'Only campus emails are allowed' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: true, // We set it to true!
    });

    // 5. Send back a token
    const token = createToken(user._id);
    res.status(201).json({
      message: 'User registered!',
      token,
      email: user.email,
      ecoPoints: user.ecoPoints,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. LOGIN A USER ---
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Send back a token
    const token = createToken(user._id);
    res.status(200).json({
      message: 'Login successful!',
      token,
      email: user.email,
      ecoPoints: user.ecoPoints,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
