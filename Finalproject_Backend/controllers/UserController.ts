import { Request, Response, NextFunction } from "express";
import {
  CreateCoachInput,
  CreateCustomerInput,
  CreateUserInput,
  EditUserInput,
  UserLoginInputs,
} from "../dto";
import { Coach, CoachBooking, Customer, Review, User } from "../models";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility";

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findById(id);
  }
};

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    address,
    phone,
    email,
    password,
    userRole,
    profilePictureUrl,
    preferredSports,
  } = <CreateUserInput>req.body;

  const existingUser = await FindUser("", email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    address: address,
    phone: phone,
    email: email,
    password: userPassword,
    salt: salt,
    userRole: userRole,
    profile_picture_url: profilePictureUrl,
    preferred_sports: preferredSports,
  });

  if (userRole === "Coach") {
    const coachInput: CreateCoachInput = {
      userId: createUser._id as string,
      specialization: req.body.specialization,
      experienceYears: req.body.experienceYears,
      bio: req.body.bio,
      availability: req.body.availability,
      certification: req.body.certification,
    };

    await Coach.create({
      experience_years: coachInput.experienceYears,
      coach_id: `COACH-${createUser._id}`,
      user: createUser._id,
      specialization: coachInput.specialization,
      bio: coachInput.bio,
      availability: coachInput.availability,
      certification: coachInput.certification,
    });
  } else if (userRole === "Customer") {
    const customerInput: CreateCustomerInput = {
      userId: createUser._id as string,
      preferences: req.body.preferences,
    };

    await Customer.create({
      user: createUser._id,
      preferences: customerInput.preferences,
    });
  }

  return res.json(createUser);
};

export const GetUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find();

  if (users != null) {
    return res.json(users);
  }

  return res.json({ message: "No users found" });
};

export const GetUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UserId = req.params.id;

  const user = await FindUser(UserId);

  if (user != null) {
    return res.json(user);
  }

  return res.json({ message: "User not found" });
};

export const GetCoaches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coaches = await User.find({ userRole: "Coach" });

    if (coaches.length > 0) {
      const coachIds = coaches.map((coach) => coach._id);
      const coachDetails = await Coach.find({ user: { $in: coachIds } });

      const coachesWithDetails = coaches.map((coach: any) => {
        const coachDetail = coachDetails.find(
          (detail) => detail.user.toString() === coach._id.toString()
        );

        return {
          ...coach.toObject(),
          coachDetails: coachDetail || null,
        };
      });

      return res.status(200).json(coachesWithDetails);
    } else {
      return res.status(404).json({ message: "No coaches found" });
    }
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return next({
      status: 500,
      message: "Server error while fetching coaches",
      error: (error as Error).message,
    });
  }
};

export const GetCoachById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const coach = await User.findOne({ _id: id, userRole: "Coach" });

    if (coach) {
      const coachDetails = await Coach.findOne({ user: id });

      return res.status(200).json({ ...coach.toObject(), coachDetails });
    } else {
      return res.status(404).json({ message: "Coach not found" });
    }
  } catch (error) {
    console.error("Error fetching coach:", error);
    return next({
      status: 500,
      message: "Server error while fetching coach",
      error: (error as Error).message,
    });
  }
};

export const GetCustomersById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const customer = await User.findOne({ _id: id, userRole: "Customer" });

    if (customer) {
      const customerDetails = await Customer.findOne({ user: id });

      return res.status(200).json({ ...customer.toObject(), customerDetails });
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    return next({
      status: 500,
      message: "Server error while fetching customer",
      error: (error as Error).message,
    });
  }
};

export const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <UserLoginInputs>req.body;

  const existingUser = await FindUser("", email);

  if (existingUser != null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: existingUser._id as string,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        userRole: existingUser.userRole,
      });

      return res.json({
        _id: existingUser._id as string,
        token: signature,
        role: existingUser.userRole,
        message: "Login successful",
      });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  }

  return res.json({ message: "User not found" });
};

export const GetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingUser = await FindUser(user._id);
    return res.json(existingUser);
  }

  return res.json({ message: "User not found" });
};

export const UpdateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    phone,
    address,
    preferredSports,
    profilePictureUrl,
  } = <EditUserInput>req.body;

  const user = req.user;

  if (user) {
    const existingUser = await FindUser(user._id);

    if (existingUser != null) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phone = phone;
      existingUser.address = address;
      existingUser.preferred_sports = preferredSports;
      existingUser.profile_picture_url = profilePictureUrl;

      const savedResult = await existingUser.save();
      return res.json(savedResult);
    }
    return res.json(existingUser);
  }

  return res.json({ message: "User not found" });
};

export const GetCoachBookingsByCoachId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findOne({ user: id });
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const bookings = await CoachBooking.find({ coachId: id });
    if (bookings.length > 0) {
      return res.status(200).json(bookings);
    } else {
      return res
        .status(404)
        .json({ message: "No bookings found for this coach" });
    }
  } catch (error) {
    console.error("Error fetching coach bookings:", error);
    return next({
      status: 500,
      message: "Server error while fetching coach bookings",
      error: (error as Error).message,
    });
  }
};

export const GetReviewsForCoach = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coachId } = req.params;

    console.log("Coach ID:", coachId);

    const reviews = await Review.find({ coachId: coachId });

    if (reviews.length > 0) {
      return res.status(200).json(reviews);
    } else {
      return res
        .status(404)
        .json({ message: "No reviews found for this coach" });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return next({
      status: 500,
      message: "Server error while fetching reviews",
      error: (error as Error).message,
    });
  }
};
