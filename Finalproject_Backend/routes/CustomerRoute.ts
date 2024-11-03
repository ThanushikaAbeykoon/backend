import express, { Request, Response, NextFunction } from "express";
import { Authenticate } from "../middlewares";
import {
  AddReview,
  BookArena,
  BookCoach,
  GetCoachBookings,
  GetCustomerBookings,
  UpdateCustomerProfileById,
} from "../controllers";

const router = express.Router();

router.use(Authenticate);
router.post("/book_arena", BookArena);
router.get("/get_customer_bookings", GetCustomerBookings);
router.get("/get_coach_bookings", GetCoachBookings);
router.post("/book_coach", BookCoach);
router.post("/add_review", AddReview);
router.patch("/update_profile/:id", UpdateCustomerProfileById);

export { router as CustomerRoute };
