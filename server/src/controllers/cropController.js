import CropProfile from "../models/cropModel.js";
import catchAsync from "../utils/catchAsync.js";

const getPaginationParams = (query, defaultLimit) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || defaultLimit, 1);

  return { page, limit, skip: (page - 1) * limit };
};

export const getCrops = catchAsync(async (req, res) => {
  const { search, month, soil } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query, 12);
  const query = {};

  if (search) {
    query.crop_name = { $regex: search.trim(), $options: "i" };
  }

  if (month) {
    query.sowing_months = { $regex: `^${month.trim()}$`, $options: "i" };
  }

  if (soil) {
    query.soil_type = { $regex: soil.trim(), $options: "i" };
  }

  const [crops, totalCrops] = await Promise.all([
    CropProfile.find(query)
      .select("-lifecycle_stages")
      .sort({ crop_name: 1, variety: 1 })
      .skip(skip)
      .limit(limit),
    CropProfile.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCrops / limit);

  return res.status(200).json({
    crops,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
  });
});

export const getCropByName = async (req, res) => {
  try {
    const cropName = req.params.crop_name?.trim();

    if (!cropName) {
      return res.status(400).json({ message: "Crop name is required" });
    }

    const crop = await CropProfile.findOne({
      crop_name: cropName.toLowerCase(),
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop profile not found" });
    }

    return res.status(200).json({ crop });
  } catch (error) {
    console.error("Error fetching crop details:", error);
    return res.status(500).json({ message: "Error fetching crop details" });
  }
};
