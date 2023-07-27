import { type NextFunction, type Request, type Response } from "express";
import jwt from "express-jwt";
import axios from "axios";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config";
import { UserService } from "../services";
import { UserStatus } from "../data/models";

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
  }),

  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const db = new UserService();

  let sub = req.user.sub;
  const token = req.headers.authorization || "";
  const u = await db.getBySub(sub);

  if (u != null) {
    req.user = { ...req.user, ...u };
    next(); return;
  }

  await axios
    .get(`${AUTH0_DOMAIN}userinfo`, { headers: { authorization: token } })
    .then(async (resp) => {
      if (resp.data && resp.data.sub) {
        let email = resp.data.email;
        const first_name = resp.data.given_name || 'UNKNOWN';
        const last_name = resp.data.family_name || 'UNKNOWN';
        sub = resp.data.sub;

        let u = await db.getBySub(sub);

        if (u != null) {
          req.user = { ...req.user, ...u };
        } else {
          if (!email) email = `${first_name}.${last_name}@yukon-no-email.ca`;

          const eu = await db.getByEmail(email);

          if (eu != null) {
            eu.sub = sub;
            await db.update(email, eu);

            req.user = { ...req.user, ...eu };
          } else {
            u = await db.create({ email, sub, status: UserStatus.INACTIVE, first_name, last_name });
            req.user = { ...req.user, ...u };
          }
        }
      } else {
        console.log("Payload from Auth0 is strange or failed for", req.user);
      }

      next();
    })
    .catch((err) => {
      console.log("ERROR pulling userinfo", err);
    });
}
