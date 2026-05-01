import { Router } from "express";
import { getMyWeather } from "../controllers/weatherController.js";
import { protect } from "../middlewares/authMiddleware.js";

const weatherRouter = Router();

weatherRouter.use(protect);
weatherRouter.get("/current", getMyWeather);

export default weatherRouter;
