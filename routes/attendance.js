const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST: Save or Update Attendance
router.post('/sync', async (req, res) => {
  const { userId, dateKey, clockInTime, clockOutTime, status } = req.body;

  try {
    const filter = { userId, dateKey };
    let totalSeconds = 0;

    // Calculate duration only if we have both times (Clock Out event)
    if (clockInTime && clockOutTime) {
      const start = new Date(clockInTime);
      const end = new Date(clockOutTime);
      
      // Difference in milliseconds converted to seconds
      const diffInMs = end.getTime() - start.getTime();
      totalSeconds = Math.max(0, Math.floor(diffInMs / 1000)); 
    }

    const update = { 
      clockInTime, 
      clockOutTime, 
      status,
      totalSeconds // Store this to match your frontend code
    };

    const record = await Attendance.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true 
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});
// GET: Get today's record for a user
// GET: Fetch all attendance records for the logged-in user
router.get('/history/:userId', async (req, res) => {
  try {
    const logs = await Attendance.find({ userId: req.params.userId }).sort({ dateKey: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

module.exports = router;