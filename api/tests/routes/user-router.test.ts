import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
import { userFactory } from "@/factories"
import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"

jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: jest.fn(),
  autheticateAndLoadUser: jest.fn(),
}))

const mockedCheckJwt = checkJwt as unknown as jest.Mock
const mockedAutheticateAndLoadUser = autheticateAndLoadUser as unknown as jest.Mock

describe("api/src/routes/user-router.ts", () => {
  beforeEach(() => {
    mockedCheckJwt.mockImplementation((req: Request, res: Response, next: NextFunction) => next())
  })

  describe("GET /api/user/me", () => {
    test("when authenticated returns the current user", async () => {
      const user = userFactory.build()

      mockedAutheticateAndLoadUser.mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          req.user = user
          next()
        }
      )

      return request(app)
        .get("/api/user/me")
        .expect("Content-Type", /json/)
        .expect(200, { data: JSON.parse(JSON.stringify(user.dataValues)) })
    })

    // TODO: re-write the user-router such that the app does not 500 on bad auth
    test("when not checkJwt failes", async () => {
      mockedCheckJwt.mockImplementation(() => {
        throw new Error("Error: getaddrinfo ENOTFOUND xxxxxxxxxxx.eu.auth0.com")
      })

      return request(app)
        .get("/api/user/me")
        .expect("Content-Type", /text/)
        .expect(500)
        .then((response) => {
          expect(response.text).toContain("Error: getaddrinfo ENOTFOUND xxxxxxxxxxx.eu.auth0.com")
        })
    })
    test("when autheticateAndLoadUser failes", async () => {})
  })
})
