const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await User.find({ isSuperAdmin: false }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create employee
router.post('/', async (req, res) => {
  const { name, email, password, designation } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already exists' });

    user = new User({ name, email, password, designation, isSuperAdmin: false });
    await user.save();
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, designation: user.designation }
    });
  } catch (err) {
    console.error("Employee Creation Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Employee Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, isSuperAdmin: false });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'employee' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'employee',
        designation: user.designation
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
