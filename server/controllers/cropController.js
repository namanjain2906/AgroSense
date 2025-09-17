import Cropdata from '../models/Cropdata.js';
import Crops from '../models/Crops.js';
// Create a new crop
export const createCrop = async (req, res) => {
  try {
    // Get user from auth middleware if available
    const farmerId = req.user?.id || req.body.farmerId;
    if (!farmerId) {
      return res.status(401).json({ error: 'Unauthorized: No farmerId found.' });
    }
    const crop = new Crops({ ...req.body, farmerId });
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const getCropData = async (req, res) => {
  try {
    const cropData = await Cropdata.find({});
    res.json({ success: true, message: cropData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get crops for logged-in user
export const getUserCrops = async (req, res) => {
  try {
    const farmerId = req.user?.id;
    if (!farmerId) {
      return res.status(401).json({ error: 'Unauthorized: No farmerId found.' });
    }
    const crops = await Crops.find({ farmerId });
    res.json({ success: true, crops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
