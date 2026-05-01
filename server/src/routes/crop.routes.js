import { Router } from "express";
import { getCropByName, getCrops } from "../controllers/cropController.js";

const cropRouter = Router();

cropRouter.get("/", getCrops);
cropRouter.get("/:crop_name", getCropByName);

export default cropRouter;
