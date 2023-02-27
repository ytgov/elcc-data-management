import express, { Request, Response } from "express";
import { CentreSubmissionService, CentreService, LogService } from "../services";
import { RequireAdmin } from "../middleware";

export const centreSubmissionRouter = express.Router();
const db = new CentreSubmissionService();
const centreDB = new CentreService();
const logService = new LogService();

centreSubmissionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centreSubmissions = await db.getAll();
    res.status(200).json(centreSubmissions);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.create(req.body);
    await centreDB.updateDate(req.body.centre_id, req.body.date);

    await logService.create({
      user_email: req.user.email,
      operation: `Create record ${centreSubmission.id}`,
      table_name: "CentreSubmission",
      data: JSON.stringify(centreSubmission)
    });

    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.get(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.update(req.body);

    await logService.create({
      user_email: req.user.email,
      operation: `Update record ${centreSubmission.id}`,
      table_name: "CentreSubmission",
      data: JSON.stringify(centreSubmission)
    });

    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreSubmissionRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.delete(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
