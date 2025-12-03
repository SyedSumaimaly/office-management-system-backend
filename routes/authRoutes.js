const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email, isSuperAdmin: true });
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials or not a super admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const { password: pw, ...userData } = user.toObject();
    const token = jwt.sign({ id: user._id, role: 'super_admin' }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Login successful', user: userData, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});



// Employee Login
router.post('/employee/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, isSuperAdmin: false });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'employee' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'employee', designation: user.designation } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
