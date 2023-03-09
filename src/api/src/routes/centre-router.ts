import express, { Request, Response } from "express";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { RequireAdmin } from "../middleware";
import { CentreService, CentreSubmissionService, LogService } from "../services";

export const centreRouter = express.Router();
centreRouter.use(checkJwt);
centreRouter.use(loadUser);

const db = new CentreService();
const submissionDb = new CentreSubmissionService();
const logService = new LogService();

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centres = await db.getAll();
    res.json({ data: centres });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await db.create(req.body);
    await logService.create({
      user_email: req.user.email,
      operation: `Create record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre),
    });
    res.json({ data: centre });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const centre = await db.get(parseInt(id));
  res.json(centre);
});

centreRouter.get("/:id/enrollment", async (req: Request, res: Response) => {
  const { id } = req.params;
  const centre = await db.get(parseInt(id));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  res.json({ data: [2, 8, 14, 5, 2, 4, 2] });
});

centreRouter.get("/:id/worksheets", async (req: Request, res: Response) => {
  const { id } = req.params;
  let worksheets = await submissionDb.getByCentreId(parseInt(id));

  res.json({ data: worksheets });
});

centreRouter.post("/:id/worksheets", async (req: Request, res: Response) => {
  const { id } = req.params;
  const centre = await db.get(parseInt(id));

  req.body.centre_id = id;
  req.body.start_date = new Date();
  req.body.end_date = new Date();
  req.body.payment = 0;
  req.body.submitted_by = req.user.email;
  req.body.submitted_date = new Date();

  await submissionDb.create(req.body);

  let worksheets = await submissionDb.getByCentreId(parseInt(id));

  res.json({ data: worksheets });
});

centreRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const centre = await db.update(parseInt(id), req.body);
    await logService.create({
      user_email: req.user.email,
      operation: `Update record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre),
    });
    res.json({ data: centre });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

centreRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const centre = await db.delete(parseInt(id));
    res.json({ data: centre });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
