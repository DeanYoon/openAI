import jwt from "jsonwebtoken";

const REACT_APP_JWT_SECRET = "afnndasjdnlawnd";

// Middleware to verify JWT token and extract user ID
export const authMiddleware = (req: any, res: any, next: any) => {
  // Check for Authorization header
  const authHeader = req.headers;
  if (!authHeader) {
    return res.status(401).send("Missing Authorization header");
  }

  // Extract token from Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token and extract user ID
  try {
    const decodedToken: any = jwt.verify(token, REACT_APP_JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
