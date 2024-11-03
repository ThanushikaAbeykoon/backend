import mongoose, { Schema, Document, Model } from "mongoose";

interface UserDoc extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  userRole: string;
  profile_picture_url: string;
  preferred_sports: string[];
}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    userRole: { type: String, required: true },
    profile_picture_url: { type: String },
    preferred_sports: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>("User", UserSchema);

export { User };
