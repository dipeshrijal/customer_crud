const { verifyToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error("Invalid token", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
