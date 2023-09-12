import { Request, Response, NextFunction } from "express"

import { User } from "@/models"

export function mockCurrentUser(user: User) {
  jest.mock("@/middleware/authz.middleware", () => ({
    checkJwt: (req: Request, res: Response, next: NextFunction) => {
      next()
    },
    authenticateAndLoadUser: (req: Request, res: Response, next: NextFunction) => {
      req.user = user
      next()
    },
  }))
}

export default mockCurrentUser
