import jwt from "jsonwebtoken";

// Middleware to verify the token
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assumes token is passed as "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const user = jwt.verify(token, process.env.CLIENT_SECRET);
    // Attach the user info to the request object
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default authenticateToken;
