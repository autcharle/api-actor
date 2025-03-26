import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "National"; // You should store this in an environment variable

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assumes token is passed as "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // Attach the user info to the request object
    req.user = user;
    next();
  });
};

export default authenticateToken;
