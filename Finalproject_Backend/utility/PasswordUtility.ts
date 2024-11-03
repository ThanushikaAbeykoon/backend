import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload, UserPayload } from "../dto";
import { APP_SECRET } from "../config";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload: UserPayload) => {
  return jwt.sign(payload, APP_SECRET);
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    )) as AuthPayload;

    req.user = payload;
    console.log("User role from token:", req.user.userRole);

    return true;
  }
  return false;
};
