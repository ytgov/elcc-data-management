import { type NextFunction, type Request, type Response } from "express"
import jwt from "express-jwt"
import jwksRsa from "jwks-rsa"
import { isNil } from "lodash"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "@/config"
import { User, UserStatus } from "@/models"
import auth0Integration from "@/integrations/auth0-integration"

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_DOMAIN + "/",
  algorithms: ["RS256"],
})

function isAuthenticatedRequest(req: Request): req is Request & { user: User } {
  // TODO: check if this should also check user.status or any other fields
  const user = req.user
  if (user instanceof User && !isNil(user.sub) && user.status === UserStatus.ACTIVE) {
    return true
  }

  return false
}

export async function autheticateAndLoadUser(req: Request, res: Response, next: NextFunction) {
  if (isAuthenticatedRequest(req)) {
    console.warn(
      'Already authenticated, "autheticateAndLoadUser" not have been called a second time'
    )
    return next()
  }

  const token = req.headers.authorization
  if (isNil(token)) {
    return res.status(401).json({ error: "No token provided" })
  }

  return auth0Integration
    .getUserInfo(token)
    .then(async ({ sub, email, firstName, lastName }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore I can't figure out how to override express-jwt's req.user type definition
      req.user = await User.findOne({ where: { sub }, include: ["roles"] })

      if (isNil(req.user)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore I can't figure out how to override express-jwt's req.user type definition
        req.user = await User.findByPk(email, { include: ["roles"] })
        if (!isNil(req.user)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore I can't figure out how to override express-jwt's req.user type definition
          req.user.update({ sub, firstName, lastName })
        }
      }

      if (isNil(req.user)) {
        req.user = await User.create({
          email,
          sub,
          status: UserStatus.ACTIVE,
          firstName,
          lastName,
        })
      }

      if (!isAuthenticatedRequest(req)) {
        throw new Error("Failed to authenticate user")
      }

      return next()
    })
    .catch((error) => {
      return res.status(401).json({ message: error.message })
    })
}
