import mongoose, { Schema, Document, Model } from "mongoose";

export interface CoachBookingDoc extends Document {
  bookingId: mongoose.Schema.Types.ObjectId;
  coachId: mongoose.Schema.Types.ObjectId;
  customerId: mongoose.Schema.Types.ObjectId;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  totalCost: number;
}

const CoachBookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookingDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const CoachBooking = mongoose.model<CoachBookingDoc>(
  "CoachBooking",
  CoachBookingSchema
);

export { CoachBooking };
