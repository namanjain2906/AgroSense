import express from 'express';
import connectDB from "./db/db.js";
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import cropRouter from "./routes/crop.routes.js";
import farmRouter from "./routes/farm.routes.js";
import fieldRouter from "./routes/field.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { applySecurityMiddleware } from "./middlewares/securityMiddleware.js";
import cookieParser from "cookie-parser";
import weatherRouter from "./routes/weather.routes.js";

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
applySecurityMiddleware(app);

app.use('/api/auth', authRouter);
app.use('/api/crops', cropRouter);
app.use('/api/farms', farmRouter);
app.use('/api/fields', fieldRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/weather', weatherRouter);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
