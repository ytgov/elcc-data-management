import express, { type Request, type Response } from "express"
import moment from "moment"
import { cloneDeep, isNil, sortBy, uniq } from "lodash"

import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { RequireAdmin } from "@/middleware"
import { Centre } from "@/models"
import { type FundingLineValue } from "@/data/models"
import { CentreServices, SubmissionLineValueService, SubmissionLineService } from "@/services"

export const centreRouter = express.Router()
centreRouter.use(checkJwt)
centreRouter.use(loadUser)

const submissionLineDb = new SubmissionLineService()
const submissionValueDb = new SubmissionLineValueService()

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centres = await Centre.findAll()
    res.json({ data: centres })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await CentreServices.create(req.body, { currentUser: req.user })
    return res.json({ data: centre })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await Centre.findByPk(id)
  res.json(centre)
})

centreRouter.get("/:id/enrollment", async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await Centre.findByPk(id)
  await new Promise((resolve) => setTimeout(resolve, 5000))
  res.json({ data: [2, 8, 14, 5, 2, 4, 2] })
})

centreRouter.get("/:id/worksheets", async (req: Request, res: Response) => {
  const { id } = req.params
  const worksheets = await submissionValueDb.getAllJson({ centre_id: id })
  worksheets.forEach((w) => (w.lines = JSON.parse(w.values)))
  const groups = new Array<any>()
  const years = uniq(worksheets.map((m) => m.fiscal_year))

  for (const fiscal_year of years) {
    const yearSheets = sortBy(
      worksheets.filter((w) => w.fiscal_year == fiscal_year),
      (o) => o.date_start
    )

    const months = uniq(yearSheets.map((y) => y.date_name))

    for (const month of months) {
      const monthSheets = yearSheets.filter((m) => month == m.date_name)[0]

      const sections = uniq(monthSheets.lines.map((w) => w.section_name))
      const monthRow = {
        id: monthSheets.id,
        fiscal_year,
        month,
        year: moment.utc(monthSheets.date_start).format("YYYY"),
        sections: new Array<any>(),
      }

      for (const section of sections) {
        const lines = monthSheets.lines.filter((w) => section == w.section_name)
        monthRow.sections.push({ section_name: section, lines })
      }

      groups.push(monthRow)
    }
  }

  res.json({ data: groups })
})

centreRouter.post("/:id/worksheets", async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await Centre.findByPk(id)

  req.body.centre_id = id
  req.body.start_date = new Date()
  req.body.end_date = new Date()
  req.body.payment = 0
  req.body.submitted_by = req.user.email
  req.body.submitted_date = new Date()

  // await SomeModel.create(req.body)
  // TODO: model matching spec does not exist, create at some point.
  throw new Error("Not implemented")

  const worksheets = await submissionValueDb.getAll({ centre_id: id })
  res.json({ data: worksheets })
})

centreRouter.put("/:id/worksheet/:worksheetId", async (req: Request, res: Response) => {
  const { id, worksheetId } = req.params
  const { sections } = req.body

  const centre = await Centre.findByPk(id)
  const sheet = await submissionValueDb.getJson(parseInt(worksheetId))

  if (centre && sheet != null) {
    const lines = sections.flatMap((s: any) => s.lines)
    sheet.lines = lines

    await submissionValueDb.updateJson(parseInt(worksheetId), sheet)
    return res.json({ data: sheet })
  }

  res.status(404).send()
})

centreRouter.post("/:id/fiscal-year", async (req: Request, res: Response) => {
  const { id } = req.params
  const { fiscal_year } = req.body

  const worksheets = await submissionValueDb.getAllJson({ centre_id: parseInt(id), fiscal_year })
  if (worksheets.length > 0)
    return res.status(400).json({ message: "Fiscal year already exists for this centre" })

  const basis = await submissionLineDb.getAll({ fiscal_year })
  const year = fiscal_year.split("/")[0]
  let date = moment.utc(`${year}-04-01`)
  const lines = new Array<FundingLineValue>()

  for (const line of basis) {
    lines.push({
      submission_line_id: line.id as number,
      section_name: line.section_name,
      line_name: line.line_name,
      monthly_amount: line.monthly_amount,
      est_child_count: 0,
      act_child_count: 0,
      est_computed_total: 0,
      act_computed_total: 0,
    })
  }

  for (let i = 0; i < 12; i++) {
    const date_start = cloneDeep(date).startOf("month")
    const date_end = cloneDeep(date_start).endOf("month")
    date_end.set("milliseconds", 0)
    const date_name = date_start.format("MMMM")

    await submissionValueDb.createJson({
      centre_id: parseInt(id),
      fiscal_year,
      date_name,
      date_start: date_start.toDate(),
      date_end: date_end.toDate(),
      lines,
      values: "",
    })

    date = date.add(1, "month")
  }

  res.json({ data: "" })
})

centreRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await Centre.findByPk(id)
  if (isNil(centre)) {
    return res.status(404).json({ message: `Could not find Centre with id=${id}` })
  }

  try {
    // TODO: remove this, and force the front-end to send the correct data.
    // If invalid data is sent to the back-end the API should return a 422 status code.
    const cleanAttributes = {
      name: req.body.name,
      license: req.body.license,
      community: req.body.community,
      status: req.body.status,
      hotMeal: req.body.hot_meal,
      licensedFor: req.body.licensed_for,
      lastSubmission: req.body.last_submission,
    }
    return CentreServices.update(centre, cleanAttributes, { currentUser: req.user }).then(
      (updatedCentre) => {
        return res.json({ data: updatedCentre })
      }
    )
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const deletedCount = await Centre.destroy({ where: { id } })
    res.json({ data: deletedCount })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})
