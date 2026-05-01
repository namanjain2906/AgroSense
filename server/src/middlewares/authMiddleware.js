import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return process.env.JWT_SECRET;
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};
