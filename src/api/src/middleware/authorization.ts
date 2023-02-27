import { NextFunction, Request, Response } from "express";
import { UserStatus } from "../data/models";

export function RequireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user.is_admin) return res.status(403).send("You aren't an admin");
  next();
}

export function RequireActive(req: Request, res: Response, next: NextFunction) {
  if (req.user.status != UserStatus.ACTIVE) return res.status(403).send("You aren't active");

  next();
}

export function RequireRole(value: any) {
  //let role = value.role;
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Checking user:", req.user, "for role", `'${value}'`);
    next();
  };
}
