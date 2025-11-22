import { Request, Response, NextFunction } from "express"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"

import { User } from "@/models"

/**
 * Usage:
 * At the top level of a test file import:
 *   import { mockCurrentUser } from "@/support"
 *
 * Then where you want to set the current user:
 *   mockCurrentUser(currentUser)
 *
 * @param newCurrentUser - The user to set as the current user
 */
export function mockCurrentUser(newCurrentUser: User) {
  vi.mock("@/middleware/authz.middleware")

  const mockedCheckJwt = vi.mocked(checkJwt)
  mockedCheckJwt.mockImplementation((_req: Request, _res: Response, next: NextFunction) => next())

  const mockedAutheticateAndLoadUser = vi.mocked(autheticateAndLoadUser)
  mockedAutheticateAndLoadUser.mockImplementation(
    async (req: Request, _res: Response, next: NextFunction) => {
      req.user = newCurrentUser
      next()
    }
  )
}
