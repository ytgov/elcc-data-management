import express, { Request, Response } from "express";
import { VUE_APP } from "../config";

export const configRouter = express.Router();

configRouter.get("/", async (req: Request, res: Response) => {
  //return just the front variables
  //the logic for this could be paramaeterized and we could
  //have a config service that returns the config variables
  const auth = {
    domain: VUE_APP.VUE_APP_AUTH_DOMAIN,
    client_id: VUE_APP.VUE_APP_AUTH_CLIENTID,
    audience: VUE_APP.VUE_APP_AUTH_AUDIENCE,
    logout_redirect: VUE_APP.VUE_APP_FRONTEND_URL,
  };

  res.json({ ...auth, version: process.env.npm_package_version });
});
