import express, { Request, Response, NextFunction } from "express";
import {
  CreateUser,
  GetUsers,
  GetUserById,
  UserLogin,
  GetUserProfile,
  UpdateUserProfile,
  GetCoaches,
  GetReviewsForCoach,
  GetCoachById,
  GetCustomersById,
  GetCoachBookingsByCoachId,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/register", CreateUser);

router.post("/login", UserLogin);

router.get("/users", GetUsers);

router.get("/users/:id", GetUserById);

router.get("/customers/:id", GetCustomersById);

router.get("/coaches", GetCoaches);

router.get("/coaches/:id", GetCoachById);

router.get("/coach/bookings/:id", GetCoachBookingsByCoachId);

router.get("/coach_reviews/:coachId", GetReviewsForCoach);

router.get("/profile", Authenticate, GetUserProfile);

router.patch("/profile", Authenticate, UpdateUserProfile);

export { router as UserRoute };
