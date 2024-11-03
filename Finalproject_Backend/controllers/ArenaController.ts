import { Request, Response, NextFunction } from "express";
import { Arena } from "../models";
import { CreateArenaInput } from "../dto";

export const CreateArena = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      location,
      capacity,
      description,
      availability,
      image_url,
      pricing_model,
      price,
    } = <CreateArenaInput>req.body;

    const arena = new Arena({
      name,
      location,
      capacity,
      description,
      availability,
      image_url,
      pricing_model,
      price,
    });

    const result = await arena.save();
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating arena:", error);
    return res.status(400).json({ message: "Failed to create arena", error });
  }
};

export const GetArenas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const arenas = await Arena.find();
    return res.status(200).json(arenas);
  } catch (error) {
    console.error("Error fetching arenas:", error);
    return res.status(400).json({ message: "Failed to fetch arenas", error });
  }
};

export const GetArenaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const arena = await Arena.findById(id);
    return res.status(200).json(arena);
  } catch (error) {
    console.error("Error fetching arena:", error);
    return res.status(400).json({ message: "Failed to fetch arena", error });
  }
};

export const DeleteArena = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await Arena.findByIdAndDelete(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting arena:", error);
    return res.status(400).json({ message: "Failed to delete arena", error });
  }
};

export const UpdateArena = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      capacity,
      description,
      availability,
      image_url,
      pricing_model,
      price,
    } = <CreateArenaInput>req.body;

    const result = await Arena.findByIdAndUpdate(
      id,
      {
        name,
        location,
        capacity,
        description,
        availability,
        image_url,
        pricing_model,
        price,
      },
      { new: true }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating arena:", error);
    return res.status(400).json({ message: "Failed to update arena", error });
  }
};
