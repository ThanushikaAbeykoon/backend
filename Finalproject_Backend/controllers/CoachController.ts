import { Request, Response, NextFunction } from "express";
import { Coach, CoachBooking, User } from "../models";

export const GetCoachAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user?.userRole === "Coach") {
      const bookings = await CoachBooking.find({ coachId: user._id });
      return res.status(200).json(bookings);
    } else {
      return res
        .status(403)
        .json({ message: "Only coaches can view their bookings" });
    }
  } catch (error) {
    next(error);
  }
};

export const UpdateCoachProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    specialization,
    experience_years,
    bio,
    availability,
    certification,
    price,
    firstName,
    lastName,
    phone,
    address,
    preferredSports,
    profilePictureUrl,
  } = req.body;

  const user = req.user;

  if (!user || !user._id) {
    return res.status(400).json({ message: "User is not authenticated" });
  }

  try {
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) existingUser.firstName = firstName;
    if (lastName) existingUser.lastName = lastName;
    if (phone) existingUser.phone = phone;
    if (address) existingUser.address = address;
    if (preferredSports) existingUser.preferred_sports = preferredSports;
    if (profilePictureUrl) existingUser.profile_picture_url = profilePictureUrl;

    const savedUserResult = await existingUser.save();

    const coach = await Coach.findOne({ user: existingUser._id });

    if (!coach) {
      return res.status(404).json({ message: "Coach details not found" });
    }

    if (specialization) coach.specialization = specialization;
    if (experience_years) coach.experience_years = experience_years;
    if (bio) coach.bio = bio;
    if (availability !== undefined) coach.availability = availability;
    if (certification) coach.certification = certification;
    if (price) coach.price = price;

    const savedCoachResult = await coach.save();

    return res.json({
      user: savedUserResult,
      coach: savedCoachResult,
    });
  } catch (error) {
    console.error("Error updating coach profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: (error as Error).message });
  }
};
