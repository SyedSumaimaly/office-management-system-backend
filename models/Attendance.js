const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateKey: {
        type: String, // Format: "YYYY-MM-DD" to easily find "today's" record
        required: true
    },
    clockInTime: { type: Date },
    clockOutTime: { type: Date },
    status: {
        type: String,
        enum: ['ClockedIn', 'ClockedOut'],
        default: 'ClockedOut'
    },
    totalSeconds: { type: Number, default: 0 }
});

// Indexing userId and dateKey together ensures a user only has one record per day
AttendanceSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);