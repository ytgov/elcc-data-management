import express, { type Request, type Response } from "express"
import { param } from "express-validator"
import { checkJwt, loadUser } from "../middleware/authz.middleware"
import { ReturnValidationErrors } from "../middleware"
import { FundingPeriodService } from "../services"

export const fundingPeriodRouter = express.Router()

fundingPeriodRouter.use(checkJwt)
fundingPeriodRouter.use(loadUser)

const db = new FundingPeriodService()

fundingPeriodRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await db.getAll() })
})

fundingPeriodRouter.put(
  "/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params
    await db.update(parseInt(id), req.body)

    res.json({ data: req.body })
  }
)

fundingPeriodRouter.post("/", async (req: Request, res: Response) => {
  await db.create(req.body)

  res.json({ data: req.body })
})

fundingPeriodRouter.delete("/:id", async (req: Request, res: Response) => {
  res.json({})
})
