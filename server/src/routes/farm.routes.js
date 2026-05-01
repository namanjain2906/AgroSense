import { Router } from "express";
import {
  createFarm,
  deleteFarm,
  getFarmDashboard,
  getMyFarm,
  updateFarm,
} from "../controllers/farmController.js";
import { protect } from "../middlewares/authMiddleware.js";

const farmRouter = Router();

farmRouter.use(protect);

farmRouter.post("/", createFarm);
farmRouter.get("/me", getMyFarm);
farmRouter.get("/dashboard", getFarmDashboard);
farmRouter.put("/:farmId", updateFarm);
farmRouter.delete("/:farmId", deleteFarm);

export default farmRouter;
