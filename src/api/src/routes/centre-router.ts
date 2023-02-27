import express, { Request, Response } from "express";
import { RequireAdmin } from "../middleware";
import { CentreService, LogService } from "../services";

export const centreRouter = express.Router();
const db = new CentreService();
const logService = new LogService();

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centres = await db.getAll();
    res.status(200).json(centres);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await db.create(req.body);
    await logService.create({
      user: req.user.email,
      operation: `Create record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre)
    });
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const centre = await db.get(req.params.id);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await db.update(req.body);
    await logService.create({
      user: req.user.email,
      operation: `Update record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre)
    });
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await db.delete(req.params.id);
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
