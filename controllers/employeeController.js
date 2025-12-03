const User = require('../models/User');
const bcrypt = require("bcryptjs");

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, password, designation } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const emp = await User.create({
            name,
            email,
            password: hashedPassword,
            designation
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: {
                id: emp._id,
                name: emp.name,
                email: emp.email,
                designation: emp.designation
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error creating employee" });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ isSuperAdmin: false }).select("-password");

        res.json({
            success: true,
            employees,
            count: employees.length
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching employees" });
    }
};
