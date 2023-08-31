import { type NextFunction, type Request, type Response } from "express"
import jwt from "express-jwt"
import axios from "axios"
import jwksRsa from "jwks-rsa"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "@/config"
import User, { UserStatus } from "@/models/user"

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
})

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  let sub = req.user.sub
  const token = req.headers.authorization || ""
  const user = await User.findOne({ where: { sub } })

  if (user != null) {
    req.user = new User({ ...req.user, ...user })
    next()
    return
  }

  await axios
    .get(`${AUTH0_DOMAIN}userinfo`, { headers: { authorization: token } })
    .then(async (resp) => {
      if (resp.data && resp.data.sub) {
        let email = resp.data.email
        const firstName = resp.data.given_name || "UNKNOWN"
        const lastName = resp.data.family_name || "UNKNOWN"
        sub = resp.data.sub

        let user = await User.findOne({ where: { sub } })

        if (user != null) {
          req.user = new User({ ...req.user, ...user })
        } else {
          if (!email) email = `${firstName}.${lastName}@yukon-no-email.ca`

          const existingUser = await User.findByPk(email)

          if (existingUser != null) {
            existingUser.sub = sub
            await User.update(existingUser, { where: { email } })

            req.user = new User({ ...req.user, ...existingUser })
          } else {
            user = await User.create({ email, sub, status: UserStatus.INACTIVE, firstName, lastName })
            req.user = new User({ ...req.user, ...user })
          }
        }
      } else {
        console.log("Payload from Auth0 is strange or failed for", req.user)
      }

      next()
    })
    .catch((err) => {
      console.log("ERROR pulling userinfo", err)
    })
}
