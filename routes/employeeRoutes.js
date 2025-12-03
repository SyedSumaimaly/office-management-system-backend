const express = require('express');
const User = require('../models/User');
const router = express.Router();

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
    res.json({ user: { id: user._id, name: user.name, email: user.email, designation: user.designation } });
  } catch (err) {
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
