import mongoose, { Schema, Document, Model } from "mongoose";

interface CoachDoc extends Document {
  user: mongoose.Schema.Types.ObjectId;
  coach_id: string;
  specialization: string;
  experience_years: number;
  bio: string;
  availability: boolean;
  certification: string[];
  price: number;
}

const CoachSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coach_id: { type: String },
  specialization: { type: String },
  experience_years: { type: Number },
  bio: { type: String },
  availability: { type: Boolean },
  certification: { type: [String] },
  price: { type: Number },
});

const Coach = mongoose.model<CoachDoc>("Coach", CoachSchema);

export { Coach };
