import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerField",
    default: null,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["INFO", "WARNING", "ACTION_REQUIRED"],
    required: true,
    default: "INFO",
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
