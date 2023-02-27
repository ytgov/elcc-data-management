import express, { Request, Response } from "express";
import { RequireAdmin } from "../middleware";
import { CentreService } from "../services";

export const centreRouter = express.Router();

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const db = new CentreService();
    const centres = await db.getAll();
    res.status(200).json(centres);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreService();
    const centre = await db.create(req.body);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const db = new CentreService();
    const centre = await db.get(req.params.id);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreService();
    const centre = await db.update(req.body);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreService();
    const centre = await db.delete(req.params.id);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
