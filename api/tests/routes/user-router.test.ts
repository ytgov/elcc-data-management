import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
import { userFactory } from "@/factories"

let user: any
jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: (req: Request, res: Response, next: NextFunction) => next(),
  autheticateAndLoadUser: (req: Request, res: Response, next: NextFunction) => {
    req.user = user // Mock user data
    next()
  },
}))

describe("api/src/routes/user-router.ts", () => {
  beforeEach(() => {
    user = null
  })

  describe("GET /api/user/me", () => {
    test("when authenticated returns the current user", async () => {
      user = userFactory.build()

      return request(app)
        .get("/api/user/me")
        .expect("Content-Type", /json/)
        .expect(200, { data: JSON.parse(JSON.stringify(user.dataValues)) })
    })

    test("when not checkJwt failes", async () => {})
    test("when autheticateAndLoadUser failes", async () => {})
  })
})
