import express, { type Request, type Response } from "express"

export const testRouter = express.Router()

testRouter.get("/", async (req: Request, res: Response) => {
  res.send("Test route")
})
