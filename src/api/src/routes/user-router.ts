import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user });
});
