import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sessionModel from "../models/sessionModel.js";
import userModel from "../models/userModel.js";

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const COOKIE_SAME_SITE =
  process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax");
const COOKIE_SECURE =
  process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return process.env.JWT_SECRET;
};

const getClientMeta = (req) => ({
  ip: req.ip || req.socket?.remoteAddress || "",
  userAgent: req.get("user-agent") || "",
});

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  fields: user.fields,
  farm: user.farm,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
  });
};

const signAccessToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

const signRefreshToken = (userId, sessionId) =>
  jwt.sign({ userId, sessionId }, getJwtSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

const createSessionAndTokens = async (user, req) => {
  const { ip, userAgent } = getClientMeta(req);
  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash: "pending",
    ip,
    userAgent,
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id, session._id);

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return { accessToken, refreshToken };
};

const verifyStoredRefreshToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, getJwtSecret());
  } catch {
    return null;
  }

  if (!decoded?.userId || !decoded?.sessionId) {
    return null;
  }

  const session = await sessionModel.findOne({
    _id: decoded.sessionId,
    userId: decoded.userId,
    refreshTokenHash: hashToken(refreshToken),
    revoked: false,
  });

  if (!session) {
    return null;
  }

  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return null;
  }

  return { decoded, session, user };
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();
    const existingUser = await userModel.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await createSessionAndTokens(
      user,
      req,
    );

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
      accessToken,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Email or username and password are required",
      });
    }

    const query = email
      ? { email: email.toLowerCase().trim() }
      : { username: username.trim() };

    const user = await userModel.findOne(query).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await createSessionAndTokens(
      user,
      req,
    );

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      message: "User logged in successfully",
      user: sanitizeUser(user),
      accessToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Error logging in user" });
  }
};

export const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const storedToken = await verifyStoredRefreshToken(refreshToken);
    if (!storedToken) {
      clearRefreshTokenCookie(res);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Keep the same valid refresh token/session and only mint a new access token.
    // Rotating refresh tokens on every call can create race conditions when multiple
    // requests hit refresh at the same time, resulting in accidental logout.
    const newAccessToken = signAccessToken(storedToken.user._id);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Error refreshing token" });
  }
};

export const getMe = async (req, res) => {
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
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Error getting user" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const storedToken = await verifyStoredRefreshToken(refreshToken);

      if (storedToken) {
        storedToken.session.revoked = true;
        await storedToken.session.save();
      }
    }

    clearRefreshTokenCookie(res);
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Error logging out user" });
  }
};
