import { NextFunction, Request, Response } from "express";

export function RequireRole(value: any) {
  //let role = value.role;
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Checking user:", req.user, "for role", `'${value}'`);
    next();
  };
}
