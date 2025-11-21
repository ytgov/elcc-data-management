import { mockCurrentUser, request } from "@/support"
import { userFactory } from "@/factories"

describe("api/src/controllers/current-user-controller.ts", () => {
  describe("GET /api/current-user", () => {
    test("when authenticated returns the current user", async () => {
      const user = await userFactory.create()

      mockCurrentUser(user)

      const response = await request()
        .get("/api/current-user")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body).toHaveProperty("user")
      expect(response.body).toHaveProperty("policy")
      expect(response.body.user.email).toBe(user.email)
    })
  })
})
