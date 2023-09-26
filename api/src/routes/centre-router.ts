import express, { type Request, type Response } from "express"
import { isNil } from "lodash"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { RequireAdmin } from "@/middleware"
import { Centre, FundingSubmissionLineJson, FundingSubmissionLineValue, User } from "@/models"
import { CentreServices, FundingSubmissionLineJsonServices } from "@/services"

import { FundingSubmissionLineJsonSerializer } from "@/serializers"

export const centreRouter = express.Router()
centreRouter.use(checkJwt)
centreRouter.use(autheticateAndLoadUser)

centreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const centres = await Centre.findAll()
    res.json({ data: centres })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

centreRouter.post("/", RequireAdmin, async (req: Request, res: Response) => {
  // TODO: figure out how to push this logic into the authentication layer
  if (!(req.user instanceof User)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const centre = await CentreServices.create(req.body, { currentUser: req.user })
    return res.json({ data: centre })
  } catch (err) {
    return res.status(500).json({ message: err })
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
  const worksheets = await FundingSubmissionLineJson.findAll({ where: { centreId: id } })
  const serializedGroups = FundingSubmissionLineJsonSerializer.serializeWorksheetsView(worksheets)
  return res.json({ data: serializedGroups })
})

centreRouter.post("/:id/worksheets", async (req: Request, res: Response) => {
  // TODO: figure out how to push this logic into the authentication layer
  if (!(req.user instanceof User)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { id } = req.params
  const centre = await Centre.findByPk(id)

  if (isNil(centre)) {
    return res.status(404).json({ message: "Centre not found" })
  }

  req.body.centre_id = id
  req.body.start_date = new Date()
  req.body.end_date = new Date()
  req.body.payment = 0
  req.body.submitted_by = req.user.email
  req.body.submitted_date = new Date()

  // await SomeModel.create(req.body)
  // TODO: model matching spec does not exist, create at some point.
  throw new Error("Not implemented")

  const worksheets = await FundingSubmissionLineValue.findAll({
    where: { centreId: id },
    include: "values",
  })
  res.json({ data: worksheets })
})

centreRouter.put("/:id/worksheet/:worksheetId", async (req: Request, res: Response) => {
  const { id, worksheetId } = req.params
  const { sections } = req.body

  const centre = await Centre.findByPk(id)
  if (isNil(centre)) {
    return res.status(404).json({ message: "Centre not found" })
  }

  const sheet = await FundingSubmissionLineJson.findByPk(worksheetId)
  if (isNil(sheet)) {
    throw new Error("Worksheet not found")
  }

  // TODO: make the front-end handle this conversion
  const lines = sections.flatMap((s: any) => s.lines)
  const values = JSON.stringify(lines)
  return sheet
    .update({ values })
    .then((updatedSheet) => {
      return res.json({ data: updatedSheet })
    })
    .catch((error) => {
      return res.status(422).json({ message: error.message })
    })
})

centreRouter.post("/:id/fiscal-year", async (req: Request, res: Response) => {
  const centerId = parseInt(req.params.id)
  const { fiscal_year: fiscalYear } = req.body

  return FundingSubmissionLineJsonServices.bulkCreate(centerId, fiscalYear)
    .then((fundingSubmissionLineJsons) => {
      return res.json({ data: fundingSubmissionLineJsons })
    })
    .catch((error) => {
      return res.status(422).json({ message: error.message })
    })
})

centreRouter.put("/:id", RequireAdmin, async (req: Request, res: Response) => {
  // TODO: figure out how to push this logic into the authentication layer
  if (!(req.user instanceof User)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

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
