import { Request, Response, NextFunction } from "express"

import { User } from "@/models"

export function mockCurrentUser(user: User) {
  jest.mock("@/middleware/authz.middleware", () => ({
    checkJwt: (req: Request, res: Response, next: NextFunction) => {
      console.log("mocked checkJwt")
      next()
    },
    authenticateAndLoadUser: (req: Request, res: Response, next: NextFunction) => {
      console.log("mocked authenticateAndLoadUser")
      req.user = user
      next()
    },
  }))
}

export default mockCurrentUser
