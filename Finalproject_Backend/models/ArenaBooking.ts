import mongoose, { Schema, Document, Model } from "mongoose";

export interface ArenaBookingDoc extends Document {
  bookingId: mongoose.Schema.Types.ObjectId;
  arenaId: mongoose.Schema.Types.ObjectId;
  customerId: mongoose.Schema.Types.ObjectId;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  totalCost: number;
}

const ArenaBookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    arenaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arena",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookingDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const ArenaBooking = mongoose.model<ArenaBookingDoc>(
  "ArenaBooking",
  ArenaBookingSchema
);

export { ArenaBooking };
