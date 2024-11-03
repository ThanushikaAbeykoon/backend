import mongoose, { Schema, Document, Model } from "mongoose";

interface ArenaDoc extends Document {
  arena_id: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  availability?: string;
  image_url?: string;
  pricing_model?: string;
  price?: number;
}

const ArenaSchema = new Schema({
  arena_id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, required: true },
  availability: { type: String },
  image_url: { type: String },
  pricing_model: { type: String },
  price: { type: Number },
});

const Arena = mongoose.model<ArenaDoc>("Arena", ArenaSchema);

export { Arena };
