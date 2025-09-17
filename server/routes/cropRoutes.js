import express from 'express';
import { getCropData, createCrop } from '../controllers/cropController.js';
import jwt from 'jsonwebtoken';

const cropRouter = express.Router();

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
cropRouter.get('/cropdata', getCropData);

// Get crops for logged-in user
import { getUserCrops } from '../controllers/cropController.js';
cropRouter.get('/user', authenticate, getUserCrops);
cropRouter.post('/', authenticate, createCrop);

export default cropRouter;