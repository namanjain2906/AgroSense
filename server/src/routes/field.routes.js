import { Router } from "express";
import {
  createField,
  deactivateField,
  getMyFields,
  getFieldStatus,
  logFieldAction,
  getFieldReport,
} from "../controllers/fieldController.js";
import { protect } from "../middlewares/authMiddleware.js";

const fieldRouter = Router();

fieldRouter.use(protect);

fieldRouter.post("/", createField);
fieldRouter.get("/", getMyFields);
fieldRouter.put("/:fieldId/log-action", logFieldAction);
fieldRouter.patch("/:fieldId/deactivate", deactivateField);
fieldRouter.get("/:fieldId/status", getFieldStatus);
fieldRouter.get("/:fieldId/report", getFieldReport);

export default fieldRouter;
