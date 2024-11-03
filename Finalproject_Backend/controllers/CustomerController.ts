import { Request, Response, NextFunction } from "express";
import {
  Arena,
  ArenaBooking,
  CoachBooking,
  Customer,
  Review,
  User,
} from "../models";
import { CreateArenaBookingInput, CreateCoachBookingInput } from "../dto";

export const BookArena = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Customer") {
      const {
        bookingId,
        arenaId,
        bookingDate,
        startTime,
        endTime,
        status,
        totalCost,
      } = <CreateArenaBookingInput>req.body;

      const bookArena = await ArenaBooking.create({
        bookingId,
        arenaId,
        customerId: user._id,
        bookingDate,
        startTime,
        endTime,
        status,
        totalCost,
      });

      const result = await bookArena.save();
      return res.status(200).json({
        message: "Arena booked successfully",
        data: result,
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only customers can book arenas" });
    }
  } catch (error) {
    next(error);
  }
};

export const GetCustomerBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Customer") {
      const bookings = await ArenaBooking.find({ customerId: user._id });
      return res.status(200).json(bookings);
    } else {
      return res
        .status(403)
        .json({ message: "Only customers can view their bookings" });
    }
  } catch (error) {
    next(error);
  }
};

export const GetCoachBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Customer") {
      const bookings = await CoachBooking.find({ customerId: user._id });
      return res.status(200).json(bookings);
    } else {
      return res
        .status(403)
        .json({ message: "Only customers can view their bookings" });
    }
  } catch (error) {
    next(error);
  }
};

export const BookCoach = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Customer") {
      const {
        bookingId,
        coachId,
        bookingDate,
        startTime,
        endTime,
        status,
        totalCost,
      } = <CreateCoachBookingInput>req.body;

      const existingBooking = await CoachBooking.findOne({
        coachId,
        bookingDate,
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
        ],
      });

      if (existingBooking) {
        return res.status(409).json({
          message: "Coach is already booked for the selected date and time",
        });
      }

      const bookCoach = await CoachBooking.create({
        bookingId,
        coachId,
        customerId: user._id,
        bookingDate,
        startTime,
        endTime,
        status,
        totalCost,
      });

      const result = await bookCoach.save();
      return res.status(200).json({
        message: "Coach booked successfully",
        data: result,
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only customers can book coaches" });
    }
  } catch (error) {
    next(error);
  }
};

export const AddReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Customer") {
      const { review, rating, coachId, reviewDate, reviewId } = req.body;

      const reviewData = {
        review,
        rating,
        customerId: user._id,
        coachId,
        reviewId,
      };

      const result = await Review.create(reviewData);
      return res.status(201).json(result);
    } else {
      return res
        .status(403)
        .json({ message: "Only customers can add reviews" });
    }
  } catch (error) {
    next(error);
  }
};

export const UpdateCustomerProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    membershipType,
    preferences,
    firstName,
    lastName,
    phone,
    address,
    preferredSports,
    profilePictureUrl,
  } = req.body;

  const user = req.user; // Ensure req.user is populated via authentication

  if (!user || !user._id) {
    return res.status(400).json({ message: "User is not authenticated" });
  }

  try {
    // Find the existing user
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields only if provided
    if (firstName) existingUser.firstName = firstName;
    if (lastName) existingUser.lastName = lastName;
    if (phone) existingUser.phone = phone;
    if (address) existingUser.address = address;
    if (preferredSports) existingUser.preferred_sports = preferredSports;
    if (profilePictureUrl) existingUser.profile_picture_url = profilePictureUrl;

    const savedUserResult = await existingUser.save();

    // Find the customer associated with this user
    const customer = await Customer.findOne({ user: existingUser._id });

    if (!customer) {
      return res.status(404).json({ message: "Customer details not found" });
    }

    // Update customer details only if provided
    if (membershipType) customer.membershipType = membershipType;
    if (preferences) customer.preferences = preferences;

    const savedCustomerResult = await customer.save();

    return res.json({
      user: savedUserResult,
      customer: savedCustomerResult,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: (error as Error).message });
  }
};
