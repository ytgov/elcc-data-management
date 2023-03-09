import express, { Request, Response } from "express";
import { checkJwt, loadUser } from "../middleware/authz.middleware";

export const userRouter = express.Router();

userRouter.use(checkJwt);
userRouter.use(loadUser);

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user });
});
