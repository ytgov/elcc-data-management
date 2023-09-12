import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
// import mockCurrentUser from "@/support/mock-current-user"

const userData = { id: 1, name: "John Doe" }
jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: (req: Request, res: Response, next: NextFunction) => next(),
  autheticateAndLoadUser: (req: Request, res: Response, next: NextFunction) => {
    req.user = userData // Mock user data
    next()
  },
}))

describe("api/src/routes/user-router.ts", () => {
  describe("GET /api/user/me", () => {
    test("when authenticated returns the current user", async () => {
      // mockCurrentUser(user)

      return request(app)
        .get("/api/user/me")
        .expect("Content-Type", /json/)
        .expect(200, { data: userData })
    })

    test("when not authenticated returns 401", async () => {})
  })
})
