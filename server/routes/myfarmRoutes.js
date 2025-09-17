import express from 'express';
import { createFarm, getUserFarm } from '../controllers/myfarmController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth middleware to extract user from JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['Authorization'];
  const token = authHeader?.split(' ')[1] || req.body.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/myfarm/user (protected)
router.get('/user', authenticate, getUserFarm);

// POST /api/myfarm (protected)
router.post('/', authenticate, createFarm);

export default router;
