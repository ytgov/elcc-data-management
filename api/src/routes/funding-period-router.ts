import express, { type Request, type Response } from "express"
import { param } from "express-validator"
import { isNil } from "lodash"

import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { ReturnValidationErrors } from "@/middleware"
import { FundingPeriod } from "@/models"

export const fundingPeriodRouter = express.Router()

fundingPeriodRouter.use(checkJwt)
fundingPeriodRouter.use(loadUser)

fundingPeriodRouter.get("/", async (req: Request, res: Response) => {
  const fundingPeriods = await FundingPeriod.findAll()
  res.json({ data: fundingPeriods })
})

fundingPeriodRouter.put(
  "/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const fundingPeriod = await FundingPeriod.findByPk(id)
    if (isNil(fundingPeriod)) {
      return res.status(404).json({ message: "Funding period not found" })
    }

    return fundingPeriod
      .update(req.body)
      .then((updatedFundingPeriod) => {
        return res.json({ data: updatedFundingPeriod })
      })
      .catch((error) => {
        res.status(422).json({ message: error.message })
      })
  }
)

fundingPeriodRouter.post("/", async (req: Request, res: Response) => {
  return FundingPeriod.create(req.body)
    .then((fundingPeriod) => {
      res.json({ data: fundingPeriod })
    })
    .catch((error) => {
      res.status(422).json({ message: error.message })
    })
})

fundingPeriodRouter.delete("/:id", async (req: Request, res: Response) => {
  res.json({})
})
