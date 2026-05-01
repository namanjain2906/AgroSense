import mongoose from "mongoose";
import CropProfile from "../models/cropModel.js";
import FarmerField from "../models/farmerFieldModel.js";
import Farm from "../models/farmModel.js";
import userModel from "../models/userModel.js";
import { getCurrentWeather } from "../services/weatherService.js";
import { calculateDaysBetween, isFutureDate } from "../utils/dateUtils.js";
import { generateDiagnosticReport } from "../services/comparisonEngine.js";

const buildLocation = (location) => {
  if (typeof location === "string") {
    return { name: location.trim() };
  }

  if (location && typeof location === "object") {
    const name = location.name?.trim();
    const lat = Number(location.coordinates?.lat ?? location.lat);
    const lon = Number(location.coordinates?.lon ?? location.lon);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

    return {
      name: name || (hasCoords ? `${lat},${lon}` : ""),
      coordinates: hasCoords ? { lat, lon } : undefined,
    };
  }

  return { name: "" };
};

const findCurrentStage = (lifecycleStages, das) =>
  lifecycleStages.find(
    (stage) => stage.day_start <= das && das <= stage.day_end,
  );

const getFinalStage = (lifecycleStages) =>
  [...lifecycleStages].sort((a, b) => b.day_end - a.day_end)[0];

const buildNextAction = (alerts) => {
  if (!alerts.length) {
    return "No immediate action required. Continue regular monitoring.";
  }

  if (alerts.some((alert) => alert.includes("Irrigation Required"))) {
    return "Water the field and update the watering log.";
  }

  if (alerts.some((alert) => alert.includes("Heat Stress"))) {
    return "Monitor the crop for heat stress and consider protective irrigation or shade where practical.";
  }

  if (alerts.some((alert) => alert.includes("Stunted Growth"))) {
    return "Inspect the field for nutrient, pest, disease, or water stress and log a new height check soon.";
  }

  return "Review warnings and continue monitoring.";
};

export const createField = async (req, res) => {
  try {
    const { cropProfileId, farmId, sowing_date, location } = req.body;
    console.log(req.body)

    if (!cropProfileId || !sowing_date || !location) {
      return res.status(400).json({
        message: "cropProfileId, sowing_date, and location are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cropProfileId)) {
      return res.status(400).json({ message: "Invalid cropProfileId" });
    }

    if (farmId && !mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({ message: "Invalid farmId" });
    }

    const sowingDate = new Date(sowing_date);
    if (Number.isNaN(sowingDate.getTime())) {
      return res.status(400).json({ message: "Invalid sowing_date" });
    }

    if (isFutureDate(sowingDate)) {
      return res
        .status(400)
        .json({ message: "sowing_date cannot be in the future" });
    }

    const cropProfile = await CropProfile.findById(cropProfileId);
    if (!cropProfile) {
      return res.status(404).json({ message: "Crop profile not found" });
    }

    if (!location.city || !location.state) {
      return res.status(400).json({ message: "Location is required" });
    }

    const farm = farmId
      ? await Farm.findOne({ _id: farmId, owner: req.user._id, is_active: true })
      : await Farm.findOne({ owner: req.user._id, is_active: true });

    if (farmId && !farm) {
      return res.status(404).json({ message: "Farm profile not found" });
    }

    const field = await FarmerField.create({
      userId: req.user._id,
      cropProfileId,
      farmId: farm?._id,
      sowing_date: sowingDate,
      last_watered_date: sowingDate,
      location: location,
    });

    if (farm) {
      await Farm.findByIdAndUpdate(farm._id, {
        $addToSet: { fields: field._id },
      });
    }
    await userModel.findByIdAndUpdate(req.user._id, {
      $addToSet: { fields: field._id },
    });

    return res.status(201).json({
      message: "Field tracking started successfully",
      field,
    });
  } catch (error) {
    console.error("Error creating farmer field:", error);
    return res.status(500).json({ message: "Error creating farmer field" });
  }
};

export const getMyFields = async (req, res) => {
  try {
    const { active, farmId } = req.query;
    const query = { userId: req.user._id };

    if (active === "true") query.is_active = true;
    if (active === "false") query.is_active = false;
    if (farmId) {
      if (!mongoose.Types.ObjectId.isValid(farmId)) {
        return res.status(400).json({ message: "Invalid farmId" });
      }

      query.farmId = farmId;
    }

    const fields = await FarmerField.find(query)
      .populate("cropProfileId", "crop_name variety region sowing_months soil_type lifecycle_stages")
      .sort({ createdAt: -1 });

    const enrichedFields = await Promise.all(fields.map(async (field) => {
      const fieldObj = field.toObject();
      const cropProfile = fieldObj.cropProfileId;

      if (cropProfile && cropProfile.lifecycle_stages && cropProfile.lifecycle_stages.length > 0) {
        // Calculate harvest_est
        const finalStage = [...cropProfile.lifecycle_stages].sort((a, b) => b.day_end - a.day_end)[0];
        const sowingDate = new Date(fieldObj.sowing_date);
        sowingDate.setDate(sowingDate.getDate() + finalStage.day_end);
        fieldObj.harvest_est = sowingDate;

        // Calculate status (Optimal/Stress) using the same weather-backed
        // comparison engine as the detailed diagnostics report.
        const das = calculateDaysBetween(fieldObj.sowing_date);
        const currentStage = cropProfile.lifecycle_stages.find(
          (stage) => stage.day_start <= das && das <= stage.day_end
        );

        try {
          const report = await generateDiagnosticReport(fieldObj, cropProfile);
          fieldObj.status = report.overall_status;
          fieldObj.overall_status_code = report.overall_status_code;
          fieldObj.current_stage_name = report.current_stage_name;
          fieldObj.das = report.das;
          fieldObj.current_temperature_c = report.weather?.current_temp ?? null;
          fieldObj.temperature_status = report.metric_comparisons?.find(
            (metric) => metric.key === "temperature",
          )?.status;
          fieldObj.report_metrics = report.report_metrics;
        } catch (error) {
          console.error("Error enriching field diagnostics:", error.message);

          if (currentStage) {
            const daysSinceLastWatered = calculateDaysBetween(fieldObj.last_watered_date);
            const maxDryDays = currentStage.ideal_conditions.max_days_without_water;
            fieldObj.status = daysSinceLastWatered > maxDryDays ? 'Stress' : 'Optimal';
          } else {
            fieldObj.status = 'Optimal';
          }
        }
      }

      return fieldObj;
    }));

    return res.status(200).json({
      count: enrichedFields.length,
      fields: enrichedFields,
    });
  } catch (error) {
    console.error("Error fetching farmer fields:", error);
    return res.status(500).json({ message: "Error fetching farmer fields" });
  }
};

export const logFieldAction = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { actionType, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(fieldId)) {
      return res.status(400).json({ message: "Invalid fieldId" });
    }

    if (!["WATER", "HEIGHT_CHECK"].includes(actionType)) {
      return res.status(400).json({
        message: "actionType must be either WATER or HEIGHT_CHECK",
      });
    }

    const field = await FarmerField.findOne({
      _id: fieldId,
      userId: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    if (actionType === "WATER") {
      field.last_watered_date = Date.now();
    }

    if (actionType === "HEIGHT_CHECK") {
      const height = Number(value);

      if (!Number.isFinite(height) || height < 0) {
        return res.status(400).json({
          message: "A non-negative numeric value is required for HEIGHT_CHECK",
        });
      }

      field.latest_reported_height_cm = height;
    }

    await field.save();

    return res.status(200).json({
      message: "Field action logged successfully",
      field,
    });
  } catch (error) {
    console.error("Error logging field action:", error);
    return res.status(500).json({ message: "Error logging field action" });
  }
};

export const deactivateField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fieldId)) {
      return res.status(400).json({ message: "Invalid fieldId" });
    }

    const field = await FarmerField.findOneAndUpdate(
      { _id: fieldId, userId: req.user._id },
      { is_active: false, harvested_date: new Date() },
      { returnDocument: "after" },
    );

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    return res.status(200).json({
      message: "Field deactivated successfully",
      field,
    });
  } catch (error) {
    console.error("Error deactivating field:", error);
    return res.status(500).json({ message: "Error deactivating field" });
  }
};

export const getFieldStatus = async (req, res) => {
  try {
    const { fieldId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fieldId)) {
      return res.status(400).json({ message: "Invalid fieldId" });
    }

    const field = await FarmerField.findOne({
      _id: fieldId,
      userId: req.user._id,
    }).populate("cropProfileId");

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const cropProfile = field.cropProfileId;
    if (!cropProfile) {
      return res.status(404).json({ message: "Linked crop profile not found" });
    }

    const lifecycleStages = cropProfile.lifecycle_stages || [];
    if (!lifecycleStages.length) {
      return res.status(422).json({
        message: "Crop profile has no lifecycle stages configured",
      });
    }

    const das = calculateDaysBetween(field.sowing_date);
    if (das < 0) {
      return res.status(400).json({
        message: "Field sowing_date is in the future",
      });
    }

    const finalStage = getFinalStage(lifecycleStages);
    const currentStage = findCurrentStage(lifecycleStages, das);

    // If the crop is older than the final interval, treat it as harvest-ready.
    if (!currentStage && das > finalStage.day_end) {
      return res.status(200).json({
        current_stage_name: "Maturity/Harvest",
        das,
        alerts: ["Crop has reached maturity/harvest stage"],
        next_action_required: "Prepare for harvest or mark this field inactive after harvesting.",
      });
    }

    if (!currentStage) {
      return res.status(422).json({
        message: "No lifecycle stage found for the calculated DAS",
        das,
      });
    }

    const alerts = [];
    const warnings = [];
    let weather = null;

    try {
      weather = await getCurrentWeather(field.location);
    } catch (error) {
      console.error("Weather service error:", error);
      warnings.push("Weather data unavailable.");
    }

    // Temperature depends on weather data, so it is skipped if the adapter fails.
    if (weather?.current_temp > currentStage.ideal_conditions.max_temp) {
      alerts.push(
        `Heat Stress: Current temperature ${weather.current_temp}C is above the ideal maximum of ${currentStage.ideal_conditions.max_temp}C for ${currentStage.stage_name}.`,
      );
    }

    // Watering can still be evaluated even when weather is unavailable.
    const daysSinceLastWatered = calculateDaysBetween(field.last_watered_date);
    const maxDryDays = currentStage.ideal_conditions.max_days_without_water;
    const rainExpected = Boolean(weather?.forecast_rain_tomorrow);

    if (daysSinceLastWatered > maxDryDays && !rainExpected) {
      alerts.push(
        `Irrigation Required: It has been ${daysSinceLastWatered} days since watering, exceeding the ${maxDryDays}-day limit for this stage.`,
      );
    }

    if (
      field.latest_reported_height_cm !== null &&
      field.latest_reported_height_cm <
        currentStage.expected_growth.min_height_cm
    ) {
      alerts.push(
        `Stunted Growth: Latest reported height ${field.latest_reported_height_cm}cm is below the expected minimum of ${currentStage.expected_growth.min_height_cm}cm for this stage.`,
      );
    }

    if (field.latest_reported_height_cm === null) {
      warnings.push("No height check has been logged yet.");
    }

    return res.status(200).json({
      current_stage_name: currentStage.stage_name,
      das,
      days_since_last_watered: daysSinceLastWatered,
      weather,
      warnings,
      alerts,
      next_action_required: buildNextAction(alerts),
    });
  } catch (error) {
    console.error("Error calculating field status:", error);
    return res.status(500).json({ message: "Error calculating field status" });
  }
};

export const getFieldReport = async (req, res) => {
  try {
    const { fieldId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fieldId)) {
      return res.status(400).json({ message: "Invalid fieldId" });
    }

    const field = await FarmerField.findOne({
      _id: fieldId,
      userId: req.user._id,
    }).populate("cropProfileId");

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const cropProfile = field.cropProfileId;
    if (!cropProfile) {
      return res.status(404).json({ message: "Linked crop profile not found" });
    }

    const report = await generateDiagnosticReport(field, cropProfile);

    return res.status(200).json(report);
  } catch (error) {
    console.error("Error generating field report:", error);
    return res.status(500).json({ message: "Error generating field report" });
  }
};
