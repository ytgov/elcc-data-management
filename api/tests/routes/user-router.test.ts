import request from "supertest"

import app from "@/app"
import mockCurrentUser from "@/support/mock-current-user"
import { userFactory } from "@/factories"

describe("api/src/routes/user-router.ts", () => {
  describe("GET /api/user/me", () => {
    test("when authenticated returns the current user", async () => {
      const user = await userFactory.create()

      mockCurrentUser(user)

      request(app)
        .get("/api/user/me")
        .expect("Content-Type", /json/)
        .expect(200, user.dataValues)
        .end((error: any, response: any) => {
          console.log(response.status)
          console.log(response.body)
          // console.log(response)
          if (error) throw error
        })
    })

    test("when not authenticated returns 401", async () => {})
  })
})
