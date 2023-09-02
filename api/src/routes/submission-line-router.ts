import express, { type Request, type Response } from "express"
import { param } from "express-validator"
import { checkJwt, loadUser } from "../middleware/authz.middleware"
import { ReturnValidationErrors } from "../middleware"
import { SubmissionLineService } from "../services"
import { FundingSubmissionLine } from "@/models"
import { FundingSubmissionLineSerializer } from "@/serializers"

export const submissionLineRouter = express.Router()

submissionLineRouter.use(checkJwt)
submissionLineRouter.use(loadUser)

const db = new SubmissionLineService()

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
  const { fiscal_year, base_lines_on, interval } = req.body
  const yearExists = await db.getAll({ fiscal_year })

  if (yearExists.length > 0) {
    return res.status(400).json({ message: "Year already exists" })
  }

  const basis = await db.getAll({ fiscal_year: base_lines_on })

  for (const line of basis) {
    delete line.id
    line.fiscal_year = fiscal_year

    await db.create(line)
  }

  res.json({ data: req.body })
})

submissionLineRouter.post("/", async (req: Request, res: Response) => {
  await db.create(req.body)

  res.json({ data: req.body })
})

submissionLineRouter.delete("/:id", async (req: Request, res: Response) => {
  res.json({})
})
