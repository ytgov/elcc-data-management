import express, { type Request, type Response } from "express"
import { param } from "express-validator"
import { isNil } from "lodash"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { ReturnValidationErrors } from "@/middleware"
import { FundingSubmissionLine } from "@/models"
import { FundingSubmissionLineSerializer } from "@/serializers"
import { FundingSubmissionLineServices } from "@/services"

/** @deprecated - prefer api/src/controllers/funding-submission-lines-controller.ts */
export const submissionLineRouter = express.Router()

submissionLineRouter.use(checkJwt)
submissionLineRouter.use(autheticateAndLoadUser)

submissionLineRouter.get("/", async (_req: Request, res: Response) => {
  const fundingSubmissionLines = await FundingSubmissionLine.findAll()

  const serailizedFundingSubmissionLines =
    FundingSubmissionLineSerializer.asTable(fundingSubmissionLines)

  res.json({ data: serailizedFundingSubmissionLines })
})

submissionLineRouter.put(
  "/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const fundingSubmissionLine = await FundingSubmissionLine.findByPk(id)
    if (isNil(fundingSubmissionLine)) {
      return res.status(404).json({ message: "Funding Submission Line not found" })
    }

    return fundingSubmissionLine
      .update(req.body)
      .then((updatedFundingSubmissionLine) => {
        return res.status(200).json({ data: updatedFundingSubmissionLine })
      })
      .catch((error) => {
        return res.status(422).json({ message: error.message })
      })
  }
)

submissionLineRouter.post("/fiscal-year", async (req: Request, res: Response) => {
  const { fiscalYear, baseLinesOn } = req.body

  const lineForFiscalYear = await FundingSubmissionLine.findOne({ where: { fiscalYear } })

  if (!isNil(lineForFiscalYear)) {
    return res.status(422).json({ message: "Year already exists" })
  }

  return FundingSubmissionLineServices.bulkCreateFrom({ fiscalYear }, baseLinesOn)
    .then((fundingSubmissionLines) => {
      res.json({ data: fundingSubmissionLines })
    })
    .catch((error) => {
      return res.status(422).json({ message: error.message })
    })
})

submissionLineRouter.post("/", async (req: Request, res: Response) => {
  const newAttributes = req.body
  return FundingSubmissionLine.create(newAttributes)
    .then((fundingSubmissionLine) => {
      res.json({ data: fundingSubmissionLine })
    })
    .catch((error) => {
      return res.status(422).json({ message: error.message })
    })
})

submissionLineRouter.delete("/:id", async (_req: Request, res: Response) => {
  res.json({})
})
