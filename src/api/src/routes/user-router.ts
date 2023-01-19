import express, { Request, Response } from "express";
import { checkJwt, loadUser } from "../middleware/authz.middleware";

export const userRouter = express.Router();

userRouter.get("/me", checkJwt, loadUser, async (req: Request, res: Response) => {
  let person = req.user;
  return res.json({ data: person });
});
