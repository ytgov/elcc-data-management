import express, { Request, Response } from "express";
import { checkJwt, loadUser } from "../middleware/authz.middleware";

export const userRouter = express.Router();

userRouter.get("/me", checkJwt, loadUser, async (req: Request, res: Response) => {
  //const db = req.store.Users as UserService;
  let person = req.user;
  //let me = await db.getByEmail(person.email);
  return res.json({ data: person });
});
