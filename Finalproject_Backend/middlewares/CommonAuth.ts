import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto";
import { ValidateSignature } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const AuthorizeArenaAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.userRole === "arena_admin") {
    next();
  } else {
    return res.status(401).json({ message: "Access denied. Admins only." });
  }
};
