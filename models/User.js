const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String },
  isSuperAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


UserSchema.pre('save', async function () { 
    if (!this.isModified('password')) {
        return; 
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        console.error("Password Hashing Failed:", err);
        throw err; 
    }
});

module.exports = mongoose.model('User', UserSchema);
