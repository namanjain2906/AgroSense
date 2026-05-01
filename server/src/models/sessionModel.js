import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true,"User is required"] },
    refreshTokenHash: { type: String, required: [true,"Refresh token is required"] },
    ip:{ type: String, default: "" },
    userAgent: { type: String, default: "" },
    revoked: { type: Boolean, default: false },
},{timestamps: true});

sessionSchema.index({ userId: 1, revoked: 1 });

const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;
