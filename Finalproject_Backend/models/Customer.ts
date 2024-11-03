import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDoc extends Document {
  user: mongoose.Schema.Types.ObjectId;
  membershipType: string;
  preferences: {};
}

const CustomerSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    preferences: { type: Object },
  },
  { timestamps: true }
);

const Customer = mongoose.model<CustomerDoc>("Customer", CustomerSchema);

export { Customer };
