import { calculateDaysBetween } from "../utils/dateUtils.js";
import { getCurrentWeather } from "./weatherService.js";

const STATUS = {
  OPTIMAL: "OPTIMAL",
  WARNING: "WARNING",
  STRESS: "STRESS",
  MISSING_DATA: "MISSING_DATA",
};

const DISPLAY_STATUS = {
  [STATUS.OPTIMAL]: "Optimal",
  [STATUS.WARNING]: "Warning",
  [STATUS.STRESS]: "Stress",
  [STATUS.MISSING_DATA]: "Missing Data",
};

const sortStages = (stages = []) =>
  [...stages].sort((a, b) => a.day_start - b.day_start);

const findCurrentStage = (stages, das) =>
  stages.find((stage) => stage.day_start <= das && das <= stage.day_end);

const getFinalStage = (stages) =>
  [...stages].sort((a, b) => b.day_end - a.day_end)[0];

const toNumberOrNull = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const formatRange = (min, max, unit = "") => {
  if (min === null && max === null) return "Not configured";
  if (min === null) return `Up to ${max}${unit}`;
  if (max === null) return `At least ${min}${unit}`;
  return `${min}${unit} - ${max}${unit}`;
};

const metric = ({
  key,
  label,
  actualValue,
  actualUnit = "",
  idealMin = null,
  idealMax = null,
  idealUnit = actualUnit,
  status,
  message,
  reason = null,
}) => ({
  key,
  metric: label,
  label,
  actual: actualValue === null ? "Not reported" : `${actualValue}${actualUnit}`,
  ideal: formatRange(idealMin, idealMax, idealUnit),
  actual_value: actualValue,
  actual_unit: actualUnit,
  ideal_min: idealMin,
  ideal_max: idealMax,
  ideal_unit: idealUnit,
  status,
  status_label: DISPLAY_STATUS[status] || status,
  message,
  reason,
});

const resolveOverallStatus = (metrics) => {
  if (metrics.some((item) => item.status === STATUS.STRESS)) return STATUS.STRESS;
  if (metrics.some((item) => item.status === STATUS.MISSING_DATA)) return STATUS.WARNING;
  if (metrics.some((item) => item.status === STATUS.WARNING)) return STATUS.WARNING;
  return STATUS.OPTIMAL;
};

const buildStageMetric = (das, currentStage, finalStage) => {
  if (!currentStage && das > finalStage.day_end) {
    return metric({
      key: "stage",
      label: "Stage",
      actualValue: das,
      actualUnit: " DAS",
      idealMin: finalStage.day_start,
      idealMax: finalStage.day_end,
      idealUnit: " DAS",
      status: STATUS.WARNING,
      reason: "HARVEST_READY",
      message: `Crop has exceeded the final ${finalStage.stage_name} window. Prepare for harvest or close tracking after harvest.`,
    });
  }

  if (!currentStage) {
    return metric({
      key: "stage",
      label: "Stage",
      actualValue: das,
      actualUnit: " DAS",
      idealMin: null,
      idealMax: null,
      idealUnit: " DAS",
      status: STATUS.STRESS,
      reason: "NO_STAGE_MATCH",
      message: "No crop lifecycle stage matches the calculated days after sowing.",
    });
  }

  const stageLength = currentStage.day_end - currentStage.day_start + 1;
  const daysIntoStage = Math.max(0, das - currentStage.day_start + 1);

  return metric({
    key: "stage",
    label: "Stage",
    actualValue: das,
    actualUnit: " DAS",
    idealMin: currentStage.day_start,
    idealMax: currentStage.day_end,
    idealUnit: " DAS",
    status: STATUS.OPTIMAL,
    reason: "EXPECTED_STAGE",
    message: `Crop is in ${currentStage.stage_name}, day ${daysIntoStage} of ${stageLength} for this stage.`,
  });
};

const buildTemperatureMetric = (weather, currentStage) => {
  if (!weather || weather.current_temp === undefined) {
    return metric({
      key: "temperature",
      label: "Temperature",
      actualValue: null,
      actualUnit: "C",
      idealMin: toNumberOrNull(currentStage.ideal_conditions?.min_temp),
      idealMax: toNumberOrNull(currentStage.ideal_conditions?.max_temp),
      idealUnit: "C",
      status: STATUS.MISSING_DATA,
      reason: "WEATHER_UNAVAILABLE",
      message: "Current weather data is unavailable, so temperature stress cannot be evaluated.",
    });
  }

  const currentTemp = toNumberOrNull(weather.current_temp);
  const minTemp = toNumberOrNull(currentStage.ideal_conditions?.min_temp);
  const maxTemp = toNumberOrNull(currentStage.ideal_conditions?.max_temp);

  if (currentTemp === null) {
    return metric({
      key: "temperature",
      label: "Temperature",
      actualValue: null,
      actualUnit: "C",
      idealMin: minTemp,
      idealMax: maxTemp,
      idealUnit: "C",
      status: STATUS.MISSING_DATA,
      reason: "WEATHER_UNAVAILABLE",
      message: "Current weather data is incomplete, so temperature stress cannot be evaluated.",
    });
  }

  if (maxTemp !== null && currentTemp > maxTemp) {
    return metric({
      key: "temperature",
      label: "Temperature",
      actualValue: currentTemp,
      actualUnit: "C",
      idealMin: minTemp,
      idealMax: maxTemp,
      idealUnit: "C",
      status: STATUS.STRESS,
      reason: "HEAT_STRESS",
      message: `Unfavorable: heat stress. Current temperature is ${currentTemp - maxTemp}C above the stage maximum.`,
    });
  }

  if (minTemp !== null && currentTemp < minTemp) {
    return metric({
      key: "temperature",
      label: "Temperature",
      actualValue: currentTemp,
      actualUnit: "C",
      idealMin: minTemp,
      idealMax: maxTemp,
      idealUnit: "C",
      status: STATUS.STRESS,
      reason: "COLD_STRESS",
      message: `Unfavorable: cold stress. Current temperature is ${minTemp - currentTemp}C below the stage minimum.`,
    });
  }

  return metric({
    key: "temperature",
    label: "Temperature",
    actualValue: currentTemp,
    actualUnit: "C",
    idealMin: minTemp,
    idealMax: maxTemp,
    idealUnit: "C",
    status: STATUS.OPTIMAL,
    reason: "WITHIN_RANGE",
    message: "Temperature is favorable for the current lifecycle stage.",
  });
};

const buildWaterMetric = (field, currentStage) => {
  const daysSinceLastWatered =
    field.last_watered_date === null || field.last_watered_date === undefined
      ? null
      : calculateDaysBetween(field.last_watered_date);
  const maxDryDays = toNumberOrNull(currentStage.ideal_conditions?.max_days_without_water);

  if (daysSinceLastWatered === null) {
    return metric({
      key: "water",
      label: "Water",
      actualValue: null,
      actualUnit: " days",
      idealMin: 0,
      idealMax: maxDryDays,
      idealUnit: " days",
      status: STATUS.MISSING_DATA,
      reason: "WATERING_DATE_MISSING",
      message: "No watering date is available. Log irrigation to evaluate crop water stress.",
    });
  }

  if (maxDryDays !== null && daysSinceLastWatered > maxDryDays) {
    return metric({
      key: "water",
      label: "Water",
      actualValue: daysSinceLastWatered,
      actualUnit: " days",
      idealMin: 0,
      idealMax: maxDryDays,
      idealUnit: " days",
      status: STATUS.STRESS,
      reason: "IRRIGATION_OVERDUE",
      message: `Irrigation is overdue by ${daysSinceLastWatered - maxDryDays} day(s). Water the field and update the log.`,
    });
  }

  if (maxDryDays !== null && daysSinceLastWatered === maxDryDays) {
    return metric({
      key: "water",
      label: "Water",
      actualValue: daysSinceLastWatered,
      actualUnit: " days",
      idealMin: 0,
      idealMax: maxDryDays,
      idealUnit: " days",
      status: STATUS.WARNING,
      reason: "IRRIGATION_DUE",
      message: "Irrigation is due now for this stage. Water soon to avoid stress.",
    });
  }

  return metric({
    key: "water",
    label: "Water",
    actualValue: daysSinceLastWatered,
    actualUnit: " days",
    idealMin: 0,
    idealMax: maxDryDays,
    idealUnit: " days",
    status: STATUS.OPTIMAL,
    reason: "ON_SCHEDULE",
    message: "Watering cadence is within the current stage tolerance.",
  });
};

const buildHeightMetric = (field, currentStage) => {
  const height = toNumberOrNull(field.latest_reported_height_cm);
  const minHeight = toNumberOrNull(currentStage.expected_growth?.min_height_cm);
  const maxHeight = toNumberOrNull(currentStage.expected_growth?.max_height_cm);

  if (height === null) {
    return metric({
      key: "height",
      label: "Height",
      actualValue: null,
      actualUnit: " cm",
      idealMin: minHeight,
      idealMax: maxHeight,
      idealUnit: " cm",
      status: STATUS.MISSING_DATA,
      reason: "HEIGHT_NOT_REPORTED",
      message: "Height has not been logged. Add a height check to complete growth diagnostics.",
    });
  }

  if (minHeight !== null && height < minHeight) {
    return metric({
      key: "height",
      label: "Height",
      actualValue: height,
      actualUnit: " cm",
      idealMin: minHeight,
      idealMax: maxHeight,
      idealUnit: " cm",
      status: STATUS.STRESS,
      reason: "BELOW_EXPECTED_HEIGHT",
      message: `Growth is behind the stage minimum by ${minHeight - height} cm. Inspect for water, nutrient, pest, or disease pressure.`,
    });
  }

  if (maxHeight !== null && maxHeight > 0 && height > maxHeight) {
    return metric({
      key: "height",
      label: "Height",
      actualValue: height,
      actualUnit: " cm",
      idealMin: minHeight,
      idealMax: maxHeight,
      idealUnit: " cm",
      status: STATUS.WARNING,
      reason: "ABOVE_EXPECTED_HEIGHT",
      message: `Reported height is ${height - maxHeight} cm above the expected stage range. Recheck the measurement if this seems unusual.`,
    });
  }

  return metric({
    key: "height",
    label: "Height",
    actualValue: height,
    actualUnit: " cm",
    idealMin: minHeight,
    idealMax: maxHeight,
    idealUnit: " cm",
    status: STATUS.OPTIMAL,
    reason: "WITHIN_RANGE",
    message: "Reported height is tracking inside the expected growth range.",
  });
};

export const generateDiagnosticReport = async (field, cropProfile) => {
  const das = calculateDaysBetween(field.sowing_date);
  const lifecycleStages = sortStages(cropProfile.lifecycle_stages || []);

  if (!lifecycleStages.length) {
    throw new Error("Crop profile has no lifecycle stages configured");
  }

  const finalStage = getFinalStage(lifecycleStages);
  const currentStage = findCurrentStage(lifecycleStages, das);
  const activeStage = currentStage || finalStage;
  const stageName =
    currentStage?.stage_name ||
    (das > finalStage.day_end ? "Maturity/Harvest" : "Unknown Stage");

  let weather = null;
  try {
    weather = await getCurrentWeather(field.location);
  } catch (error) {
    console.error("Weather service error:", error.message);
  }

  const comparisons = [buildStageMetric(das, currentStage, finalStage)];

  if (currentStage) {
    comparisons.push(
      buildTemperatureMetric(weather, currentStage),
      buildWaterMetric(field, currentStage),
      buildHeightMetric(field, currentStage),
    );
  } else if (das > finalStage.day_end) {
    comparisons.push(buildHeightMetric(field, finalStage));
  }

  const overallStatus = resolveOverallStatus(comparisons);
  const stressors = comparisons.filter((item) =>
    [STATUS.STRESS, STATUS.WARNING, STATUS.MISSING_DATA].includes(item.status),
  );

  return {
    field_id: field._id,
    crop_profile_id: cropProfile._id,
    crop_name: cropProfile.crop_name,
    variety: cropProfile.variety,
    das,
    current_stage_name: stageName,
    current_stage: {
      name: stageName,
      day_start: activeStage.day_start,
      day_end: activeStage.day_end,
    },
    weather,
    overall_status: DISPLAY_STATUS[overallStatus],
    overall_status_code: overallStatus,
    health_summary:
      overallStatus === STATUS.OPTIMAL
        ? "Crop conditions are aligned with the ideal profile for this lifecycle stage."
        : `${stressors.length} diagnostic item(s) need attention.`,
    metric_comparisons: comparisons,
    report_metrics: comparisons,
  };
};
