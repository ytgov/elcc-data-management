import express, { Request, Response } from "express"
import { CentreFundingService, CentreService, LogService } from "../services"
import { RequireAdmin } from "../middleware"

export const centreFundingRouter = express.Router()

const db = new CentreFundingService()

const centreDB = new CentreService()
const logService = new LogService()
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

centreFundingRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centreSubmission = await db.delete(req.params.id);
    res.status(200).json(centreSubmission);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
 */
