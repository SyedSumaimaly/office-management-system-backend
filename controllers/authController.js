const User = require('../models/User');
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email });

        if (!admin || !admin.isSuperAdmin) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(401).json({ success: false, error: "Incorrect password" });
        }

        const token = generateToken({
            id: admin._id,
            email: admin.email,
            isSuperAdmin: admin.isSuperAdmin
        });

        res.json({
            success: true,
            message: "Admin login successful",
            user: {
                id: admin._id,
                email: admin.email,
                token
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Login error" });
    }
};
