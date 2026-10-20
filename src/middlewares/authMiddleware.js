// middleware to authenticate JWT tokens

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    // re-check the account so deleted / banned users lose access immediately
    const user = await User.findById(decoded.id).select("role isBanned");
    if (!user) return res.status(401).json({ message: "Account no longer exists" });
    if (user.isBanned) return res.status(403).json({ message: "Your account has been banned" });

    req.user = { id: String(user._id), role: user.role }; // role comes from DB, not the token
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
