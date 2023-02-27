import express, { Request, Response } from "express";
import { CentreSubmissionService, CentreService } from "../services";
import { RequireAdmin } from "../middleware";

export const centreSubmissionRouter = express.Router();

centreSubmissionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const db = new CentreSubmissionService();
    const centreSubmissions = await db.getAll();
    res.status(200).json(centreSubmissions);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreSubmissionService();
    const centreDB = new CentreService();

    const centreSubmission = await db.create(req.body);
    await centreDB.updateDate(req.body.centre_id, req.body.date);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const db = new CentreSubmissionService();
    const centreSubmission = await db.get(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreSubmissionService();
    const centreSubmission = await db.update(req.body);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const db = new CentreSubmissionService();
    const centreSubmission = await db.delete(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
