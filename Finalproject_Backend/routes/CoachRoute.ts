import express, { Request, Response, NextFunction } from "express";
import { Authenticate } from "../middlewares";
import { GetCoachAllBookings, UpdateCoachProfileById } from "../controllers";

const router = express.Router();

router.use(Authenticate);
router.get("/get_bookings/:id", GetCoachAllBookings);
router.patch("/update_profile/:id", UpdateCoachProfileById);

export { router as CoachRoute };
