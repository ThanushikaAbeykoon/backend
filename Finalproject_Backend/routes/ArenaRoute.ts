import express, { Request, Response, NextFunction } from "express";
import {
  CreateArena,
  DeleteArena,
  GetArenas,
  UpdateArena,
} from "../controllers/ArenaController";
import { Authenticate, AuthorizeArenaAdmin } from "../middlewares";

const router = express.Router();

router.use(Authenticate);
router.get("/", GetArenas);
router.get("/:id", GetArenas);

router.post("/create", AuthorizeArenaAdmin, CreateArena);
router.patch("/:id", AuthorizeArenaAdmin, UpdateArena);
router.delete("/:id", AuthorizeArenaAdmin, DeleteArena);

export { router as ArenaRoute };
