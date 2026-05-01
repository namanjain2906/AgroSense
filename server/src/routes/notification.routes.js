import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const notificationRouter = Router();

notificationRouter.use(protect);

notificationRouter.get("/", getNotifications);
notificationRouter.put("/read-all", markAllNotificationsAsRead);
notificationRouter.put("/:id/read", markNotificationAsRead);
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
