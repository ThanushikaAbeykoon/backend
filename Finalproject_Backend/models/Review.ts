import mongoose, { Schema, Document, Model } from "mongoose";

export interface ReviewDoc extends Document {
  reviewId: mongoose.Schema.Types.ObjectId;
  customerId: mongoose.Schema.Types.ObjectId;
  coachId: mongoose.Schema.Types.ObjectId;
  rating: number;
  review: string;
}

const ReviewSchema = new Schema(
  {
    reviewId: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<ReviewDoc>("Review", ReviewSchema);

export { Review };
