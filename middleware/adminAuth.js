const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "Token required" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.isSuperAdmin) {
            return res.status(403).json({ success: false, error: "Admin access only" });
        }

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ success: false, error: "Invalid token" });
    }
};
