import express, { type Request, type Response } from "express"
import { checkJwt, loadUser } from "../middleware/authz.middleware"
import moment from "moment"
import { cloneDeep, sortBy, uniq } from "lodash"
import { RequireAdmin } from "../middleware"
import { type FundingLineValue } from "../data/models"
import {
  CentreService,
  CentreFundingService,
  LogService,
  SubmissionLineValueService,
  SubmissionLineService,
} from "../services"

export const centreRouter = express.Router()
centreRouter.use(checkJwt)
centreRouter.use(loadUser)

const db = new CentreService()
const submissionDb = new CentreFundingService()
const submissionLineDb = new SubmissionLineService()
const submissionValueDb = new SubmissionLineValueService()
const logService = new LogService()

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centres = await db.getAll()
    res.json({ data: centres })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  try {
    const centre = await db.create(req.body)
    await logService.create({
      user_email: req.user.email,
      operation: `Create record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre),
    })
    res.json({ data: centre })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await db.get(parseInt(id))
  res.json(centre)
})

centreRouter.get("/:id/enrollment", async (req: Request, res: Response) => {
  const { id } = req.params
  const centre = await db.get(parseInt(id))
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
  const centre = await db.get(parseInt(id))

  req.body.centre_id = id
  req.body.start_date = new Date()
  req.body.end_date = new Date()
  req.body.payment = 0
  req.body.submitted_by = req.user.email
  req.body.submitted_date = new Date()

  await submissionDb.create(req.body)

  const worksheets = await submissionValueDb.getAll({ centre_id: id })
  res.json({ data: worksheets })
})

centreRouter.put("/:id/worksheet/:worksheetId", async (req: Request, res: Response) => {
  const { id, worksheetId } = req.params
  const { sections } = req.body

  const centre = await db.get(parseInt(id))
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
  try {
    const centre = await db.update(parseInt(id), req.body)

    await logService.create({
      user_email: req.user.email,
      operation: `Update record ${centre.id}`,
      table_name: "Centre",
      data: JSON.stringify(centre),
    })

    res.json({ data: centre })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.delete("/:id", RequireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const centre = await db.delete(parseInt(id))
    res.json({ data: centre })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})
