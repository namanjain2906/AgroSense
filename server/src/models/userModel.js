import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    fields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FarmerField' }],
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;
