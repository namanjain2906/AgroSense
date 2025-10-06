import express from 'express';
import { getCropData, createCrop } from '../controllers/cropController.js';
import jwt from 'jsonwebtoken';
import Crops from '../models/Crops.js';

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
cropRouter.patch('/crops/:id',authenticate, async (req, res) => {
  try {
	// Get userId from JWT (assuming you use authentication middleware)
	console.log("Request to update crop:", req.params.id);
	const userId = req.user?._id || req.user?.id;
	if (!userId) {
	  return res.status(401).json({ error: 'Unauthorized' });
	}

	// Find the crop and ensure it belongs to the user
	const crop = await Crops.findOne({ _id: req.params.id, user: userId });
	if (!crop) {
	  return res.status(404).json({ error: 'Crop not found for this user' });
	}

	// Update the crop
	Object.assign(crop, req.body);
	await crop.save();

	res.json({success: true, message: 'Crop updated successfully', crop });
  } catch (err) {
	res.status(500).json({ error: 'Server error' });
  }
});

export default cropRouter;