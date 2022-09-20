import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.get("/me", async (req: Request, res: Response) => {
  //const db = req.store.Users as UserService;
  let person = req.user;
  //let me = await db.getByEmail(person.email);
  return res.json({ data: person });
});
