import app from "./src/app.js";
import { startDailyAlertCron } from "./src/jobs/dailyAlertEngine.js";
import errorHandler from "./src/middlewares/errorHandler.js";


const PORT = process.env.PORT || 3000;

// Global error handler must be the final Express middleware.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Starts the automation layer. The job runs every day at 6:00 AM Asia/Kolkata.
startDailyAlertCron();
