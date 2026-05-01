import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import catchAsync from "../utils/catchAsync.js";

const getPaginationParams = (query, defaultLimit) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || defaultLimit, 1);

  return { page, limit, skip: (page - 1) * limit };
};

export const getNotifications = catchAsync(async (req, res) => {
  const { unreadOnly } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query, 20);
  const query = { userId: req.user._id };

  if (unreadOnly === "true") {
    query.isRead = false;
  }

  const [notifications, totalNotifications] = await Promise.all([
    Notification.find(query)
      .populate("fieldId", "cropProfileId sowing_date location is_active")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalNotifications / limit);

  return res.status(200).json({
    notifications,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
  });
});

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { returnDocument: "after" },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res
      .status(500)
      .json({ message: "Error marking notification as read" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true },
    );

    return res.status(200).json({
      message: "All unread notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res
      .status(500)
      .json({ message: "Error marking all notifications as read" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification deleted successfully",
      notification,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Error deleting notification" });
  }
};
