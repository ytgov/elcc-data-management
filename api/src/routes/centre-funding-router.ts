import express, { Request, Response } from "express"

import LogServices from "@/services/log-services"
import { RequireAdmin } from "@/middleware"
import { Centre, LogOperationTypes } from "@/models"

export const centreFundingRouter = express.Router()

/*
centreFundingRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centreSubmissions = await db.getAll();
    res.status(200).json(centreSubmissions);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreFundingRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.create(req.body)
    await Centre.update({ lastSubmission: req.body.date }, { where: { id: req.body.centre_id } })

    await LogService.create({
      model: centerSubmission
      operation: LogOperationTypes.CREATE,
      currentUser: req.user,
    });

    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreFundingRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.get(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreFundingRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.update(req.body);

    await LogService.create({
      model: centerSubmission
      operation: LogOperationTypes.UPDATE,
      currentUser: req.user,
    });

    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreFundingRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.delete(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
 */
