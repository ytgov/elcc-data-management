import express, { type Request, type Response } from "express"
import { param } from "express-validator"
import { isNil } from "lodash"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { ReturnValidationErrors } from "@/middleware"
import { FundingSubmissionLine } from "@/models"
import { FundingSubmissionLineSerializer } from "@/serializers"
import { FundingSubmissionLineServices } from "@/services"

export const submissionLineRouter = express.Router()

submissionLineRouter.use(checkJwt)
submissionLineRouter.use(autheticateAndLoadUser)

submissionLineRouter.get("/", async (req: Request, res: Response) => {
  const fundingSubmissionLines = await FundingSubmissionLine.findAll()

  const serailizedFundingSubmissionLines =
    FundingSubmissionLineSerializer.serialize(fundingSubmissionLines)

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

    const newAttributes = req.body
    // TODO: make the front-end do this, or return a 422 if invalid data is sent.
    const cleanedAttributes = {
      fiscalYear: newAttributes.fiscal_year,
      sectionName: newAttributes.section_name,
      lineName: newAttributes.line_name,
      fromAge: newAttributes.from_age,
      toAge: newAttributes.to_age,
      monthlyAmount: newAttributes.monthly_amount,
    }

    return fundingSubmissionLine
      .update(cleanedAttributes)
      .then((updatedFundingSubmissionLine) => {
        return res.status(200).json({ data: updatedFundingSubmissionLine })
      })
      .catch((error) => {
        return res.status(422).json({ message: error.message })
      })
  }
)

submissionLineRouter.post("/fiscal-year", async (req: Request, res: Response) => {
  const { fiscal_year: fiscalYear, base_lines_on: baseLinesOn } = req.body

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

submissionLineRouter.delete("/:id", async (req: Request, res: Response) => {
  res.json({})
})
