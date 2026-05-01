import cron from "node-cron";
import Notification from "../models/Notification.js";
import FarmerField from "../models/farmerFieldModel.js";
import { getWeatherForLocation } from "../services/weatherService.js";
import { calculateDaysBetween } from "../utils/dateUtils.js";

const DAILY_ALERT_CRON = "0 6 * * *";
const DAILY_ALERT_TIMEZONE = "Asia/Kolkata";

const findCurrentStage = (lifecycleStages, das) =>
  lifecycleStages.find(
    (stage) => stage.day_start <= das && das <= stage.day_end,
  );

const getFieldLocation = (field) => {
  if (typeof field.location === "string") {
    return field.location;
  }

  return field.location?.name || field.location;
};

const getCropLabel = (cropProfile) =>
  [cropProfile?.crop_name, cropProfile?.variety].filter(Boolean).join(" ") ||
  "your crop";

const createNotificationPayloads = ({ field, cropProfile, currentStage, das }) => {
  const notifications = [];

  const pushNotification = ({ title, message, type = "WARNING" }) => {
    notifications.push({
      userId: field.userId,
      fieldId: field._id,
      title,
      message,
      type,
    });
  };

  return { notifications, pushNotification };
};

export const evaluateFieldAndCreateNotifications = async (field) => {
  const cropProfile = field.cropProfileId;

  if (!field.userId || !cropProfile) {
    throw new Error("Field is missing userId or populated crop profile.");
  }

  const lifecycleStages = cropProfile.lifecycle_stages || [];
  if (!lifecycleStages.length) {
    throw new Error(`Crop profile ${cropProfile._id} has no lifecycle stages.`);
  }

  const das = calculateDaysBetween(field.sowing_date);
  if (das < 0) {
    throw new Error(`Field ${field._id} has a future sowing date.`);
  }

  const currentStage = findCurrentStage(lifecycleStages, das);
  if (!currentStage) {
    return {
      fieldId: field._id,
      createdCount: 0,
      skipped: true,
      reason: "No active lifecycle stage for current DAS",
    };
  }

  const cropLabel = getCropLabel(cropProfile);
  const { notifications, pushNotification } = createNotificationPayloads({
    field,
    cropProfile,
    currentStage,
    das,
  });

  let weather = null;

  try {
    weather = await getWeatherForLocation(getFieldLocation(field));
  } catch (error) {
    console.error(
      `[DailyAlertEngine] Weather unavailable for field ${field._id}:`,
      error.message,
    );

    pushNotification({
      title: "Weather Data Unavailable",
      type: "INFO",
      message: `AgroSense could not fetch weather data for ${cropLabel}. Temperature and rain checks were skipped for DAS ${das}.`,
    });
  }

  if (weather?.current_temp > currentStage.ideal_conditions.max_temp) {
    pushNotification({
      title: "Heat Stress Warning",
      type: "WARNING",
      message: `${cropLabel} is in ${currentStage.stage_name} at DAS ${das}. Current temperature is ${weather.current_temp}C, above the ideal maximum of ${currentStage.ideal_conditions.max_temp}C.`,
    });
  }

  const daysSinceWatered = calculateDaysBetween(field.last_watered_date);
  const maxDryDays = currentStage.ideal_conditions.max_days_without_water;
  const rainForecast = Boolean(weather?.forecast_rain_tomorrow_bool);

  if (daysSinceWatered > maxDryDays && !rainForecast) {
    pushNotification({
      title: "Irrigation Needed",
      type: "ACTION_REQUIRED",
      message: `${cropLabel} has not been watered for ${daysSinceWatered} days. The ideal limit for ${currentStage.stage_name} is ${maxDryDays} days, and no rain is forecast tomorrow.`,
    });
  }

  if (
    field.latest_reported_height_cm !== null &&
    field.latest_reported_height_cm <
      currentStage.expected_growth.min_height_cm
  ) {
    pushNotification({
      title: "Stunted Growth Warning",
      type: "WARNING",
      message: `${cropLabel} is reported at ${field.latest_reported_height_cm}cm, below the expected minimum of ${currentStage.expected_growth.min_height_cm}cm for ${currentStage.stage_name}.`,
    });
  }

  if (!notifications.length) {
    return {
      fieldId: field._id,
      createdCount: 0,
      alerts: [],
    };
  }

  const createdNotifications = await Notification.insertMany(notifications);

  return {
    fieldId: field._id,
    createdCount: createdNotifications.length,
    alerts: notifications.map((notification) => notification.title),
  };
};

export const runDailyAlertEngine = async () => {
  console.log("[DailyAlertEngine] Starting daily field evaluation...");

  const fields = await FarmerField.find({ is_active: true }).populate(
    "cropProfileId",
  );

  const summary = {
    total: fields.length,
    processed: 0,
    notificationsCreated: 0,
    skipped: 0,
    failed: 0,
  };

  for (const field of fields) {
    try {
      const result = await evaluateFieldAndCreateNotifications(field);

      summary.processed += 1;
      summary.notificationsCreated += result.createdCount || 0;
      if (result.skipped) summary.skipped += 1;
    } catch (error) {
      summary.failed += 1;
      console.error(
        `[DailyAlertEngine] Failed processing field ${field._id}:`,
        error.message,
      );
    }
  }

  console.log("[DailyAlertEngine] Finished daily field evaluation:", summary);
  return summary;
};

export const startDailyAlertCron = () => {
  const task = cron.schedule(
    DAILY_ALERT_CRON,
    () => {
      runDailyAlertEngine().catch((error) => {
        console.error("[DailyAlertEngine] Cron run failed:", error);
      });
    },
    {
      scheduled: true,
      timezone: DAILY_ALERT_TIMEZONE,
    },
  );

  console.log(
    `[DailyAlertEngine] Scheduled daily alerts with cron "${DAILY_ALERT_CRON}" in ${DAILY_ALERT_TIMEZONE}`,
  );

  return task;
};
