import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Store the image URL or path
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);