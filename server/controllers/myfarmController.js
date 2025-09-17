// Get current user's farm (for weather)
export const getUserFarm = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: No ownerId found.' });
    }
    // Get the most recent farm for the user
    const farm = await Myfarm.findOne({ ownerId }).sort({ _id: -1 });
    if (!farm) {
      return res.status(404).json({ error: 'No farm found for user.' });
    }
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import Myfarm from '../models/Myfarm.js';

export const createFarm = async (req, res) => {
  try {
    // ownerId should come from req.user (set by auth middleware)
    const { farmName, location, size, soilType, irrigationType } = req.body;
    const ownerId = req.user?.id || req.body.ownerId;
    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: No ownerId found.' });
    }
    const farm = new Myfarm({ ownerId, farmName, location, size, soilType, irrigationType });
    await farm.save();
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
