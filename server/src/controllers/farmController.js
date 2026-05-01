import mongoose from "mongoose";
import Farm from "../models/farmModel.js";
import FarmerField from "../models/farmerFieldModel.js";
import userModel from "../models/userModel.js";

const buildFarmPayload = (body) => {
  const {
    name,
    location,
    size,
    size_unit,
    soil_type,
    irrigation_source,
  } = body;

  const lat = Number(location?.coordinates?.lat ?? location?.lat);
  const lon = Number(location?.coordinates?.lon ?? location?.lon);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

  return {
    name: name?.trim(),
    location: {
      city: location?.city?.trim(),
      state: location?.state?.trim(),
      country: location?.country?.trim() || "India",
      coordinates: hasCoords ? { lat, lon } : undefined,
    },
    size: Number(size),
    size_unit,
    soil_type: soil_type?.trim(),
    irrigation_source: irrigation_source?.trim(),
  };
};

const validateFarmPayload = (payload) => {
  const allowedSizeUnits = ["acre", "hectare", "sqm"];

  if (!payload.name) {
    return "Farm name is required";
  }

  if (!payload.location.city || !payload.location.state) {
    return "Farm location city and state are required";
  }

  if (!Number.isFinite(payload.size) || payload.size <= 0) {
    return "Farm size must be a positive number";
  }

  if (payload.size_unit && !allowedSizeUnits.includes(payload.size_unit)) {
    return "size_unit must be one of acre, hectare, or sqm";
  }

  return null;
};

export const createFarm = async (req, res) => {
  try {
    const payload = buildFarmPayload(req.body);
    const validationError = validateFarmPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingFarm = await Farm.findOne({
      owner: req.user._id,
      is_active: true,
    });

    if (existingFarm) {
      return res.status(409).json({
        message: "An active farm profile already exists for this user",
        farm: existingFarm,
      });
    }

    const farm = await Farm.create({
      ...payload,
      owner: req.user._id,
    });

    await userModel.findByIdAndUpdate(req.user._id, { farm: farm._id });

    return res.status(201).json({
      message: "Farm profile created successfully",
      farm,
    });
  } catch (error) {
    console.error("Error creating farm:", error);
    return res.status(500).json({ message: "Error creating farm profile" });
  }
};

export const getMyFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      owner: req.user._id,
      is_active: true,
    }).populate({
      path: "fields",
      populate: {
        path: "cropProfileId",
        select: "crop_name variety region sowing_months soil_type",
      },
    });

    if (!farm) {
      return res.status(404).json({ message: "Farm profile not found" });
    }

    return res.status(200).json({ farm });
  } catch (error) {
    console.error("Error fetching farm:", error);
    return res.status(500).json({ message: "Error fetching farm profile" });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({ message: "Invalid farmId" });
    }

    const payload = buildFarmPayload(req.body);
    const update = {};

    if (payload.size_unit && !["acre", "hectare", "sqm"].includes(payload.size_unit)) {
      return res
        .status(400)
        .json({ message: "size_unit must be one of acre, hectare, or sqm" });
    }

    if (payload.name) update.name = payload.name;
    if (payload.location.city || payload.location.state) {
      update.location = payload.location;
    }
    if (Number.isFinite(payload.size) && payload.size > 0) {
      update.size = payload.size;
    }
    if (payload.size_unit) update.size_unit = payload.size_unit;
    if (payload.soil_type !== undefined) update.soil_type = payload.soil_type;
    if (payload.irrigation_source !== undefined) {
      update.irrigation_source = payload.irrigation_source;
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: farmId, owner: req.user._id, is_active: true },
      update,
      { returnDocument: "after", runValidators: true },
    );

    if (!farm) {
      return res.status(404).json({ message: "Farm profile not found" });
    }

    return res.status(200).json({
      message: "Farm profile updated successfully",
      farm,
    });
  } catch (error) {
    console.error("Error updating farm:", error);
    return res.status(500).json({ message: "Error updating farm profile" });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({ message: "Invalid farmId" });
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: farmId, owner: req.user._id, is_active: true },
      { is_active: false },
      { returnDocument: "after" },
    );

    if (!farm) {
      return res.status(404).json({ message: "Farm profile not found" });
    }

    await FarmerField.updateMany(
      { userId: req.user._id, _id: { $in: farm.fields } },
      { is_active: false },
    );
    await userModel.findByIdAndUpdate(req.user._id, { $unset: { farm: "" } });

    return res.status(200).json({
      message: "Farm profile deactivated successfully",
      farm,
    });
  } catch (error) {
    console.error("Error deleting farm:", error);
    return res.status(500).json({ message: "Error deleting farm profile" });
  }
};

export const getFarmDashboard = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      owner: req.user._id,
      is_active: true,
    });

    if (!farm) {
      return res.status(404).json({ message: "Farm profile not found" });
    }

    const [activeFields, inactiveFields] = await Promise.all([
      FarmerField.countDocuments({ userId: req.user._id, is_active: true }),
      FarmerField.countDocuments({ userId: req.user._id, is_active: false }),
    ]);

    return res.status(200).json({
      farm,
      summary: {
        active_fields: activeFields,
        inactive_fields: inactiveFields,
        total_fields: activeFields + inactiveFields,
      },
    });
  } catch (error) {
    console.error("Error fetching farm dashboard:", error);
    return res.status(500).json({ message: "Error fetching farm dashboard" });
  }
};
