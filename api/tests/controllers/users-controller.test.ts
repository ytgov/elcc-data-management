import { mockCurrentUser, request } from "@/support"
import { userFactory } from "@/factories"
import { User } from "@/models"

describe("api/src/controllers/users-controller.ts", () => {
  let currentUser: User

  beforeEach(async () => {
    currentUser = await userFactory.create({
      roles: [User.Roles.SYSTEM_ADMINISTRATOR],
    })

    mockCurrentUser(currentUser)
  })

  describe("GET /api/users", () => {
    test("returns users array", async () => {
      await userFactory.createList(2)

      const response = await request()
        .get("/api/users")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body.users.length).toBeGreaterThanOrEqual(2)
    })

    test("returns total count", async () => {
      await userFactory.createList(2)

      const response = await request()
        .get("/api/users")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body.totalCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe("GET /api/users/:userId", () => {
    test("returns a specific user", async () => {
      const user = await userFactory.create()

      const response = await request()
        .get(`/api/users/${user.id}`)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body.user).toMatchObject({
        id: user.id,
        email: user.email,
      })
    })

    test("returns 404 when user not found", async () => {
      const response = await request()
        .get("/api/users/999999")
        .expect("Content-Type", /json/)
        .expect(404)

      expect(response.body.message).toContain("User not found")
    })
  })

  describe("POST /api/users", () => {
    test("returns the created user", async () => {
      const userData = {
        email: "newuser@example.com",
        sub: "auth0|newuser123",
        firstName: "New",
        lastName: "User",
        roles: [User.Roles.USER],
        status: User.Status.ACTIVE,
      }

      const response = await request()
        .post("/api/users")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201)

      expect(response.body.user).toMatchObject({
        email: userData.email,
        firstName: userData.firstName,
      })
    })

    test("persists the user to the database", async () => {
      const userData = {
        email: "anotheruser@example.com",
        sub: "auth0|anotheruser123",
        firstName: "Another",
        lastName: "User",
        roles: [User.Roles.USER],
        status: User.Status.ACTIVE,
      }

      await request()
        .post("/api/users")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201)

      expect(await User.findOne({ where: { email: userData.email } })).not.toBeNull()
    })
  })

  describe("PATCH /api/users/:userId", () => {
    test("returns the updated user", async () => {
      const user = await userFactory.create()
      const updates = {
        firstName: "Updated",
        lastName: "Name",
      }

      const response = await request()
        .patch(`/api/users/${user.id}`)
        .send(updates)
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body.user).toMatchObject({
        firstName: updates.firstName,
        lastName: updates.lastName,
      })
    })

    test("persists the updates to the database", async () => {
      const user = await userFactory.create()
      const updates = {
        firstName: "Updated",
        lastName: "Name",
      }

      await request()
        .patch(`/api/users/${user.id}`)
        .send(updates)
        .expect("Content-Type", /json/)
        .expect(200)

      await user.reload()
      expect(user).toMatchObject(updates)
    })

    test("returns 404 when user not found", async () => {
      const response = await request()
        .patch("/api/users/999999")
        .send({ firstName: "Test" })
        .expect("Content-Type", /json/)
        .expect(404)

      expect(response.body.message).toContain("User not found")
    })
  })

  describe("DELETE /api/users/:userId", () => {
    test("returns 204 status", async () => {
      const user = await userFactory.create()

      await request().delete(`/api/users/${user.id}`).expect(204)
    })

    test("removes user from database", async () => {
      const user = await userFactory.create()

      await request().delete(`/api/users/${user.id}`).expect(204)

      expect(await User.findByPk(user.id)).toBeNull()
    })

    test("returns 404 when user not found", async () => {
      const response = await request()
        .delete("/api/users/999999")
        .expect("Content-Type", /json/)
        .expect(404)

      expect(response.body.message).toContain("User not found")
    })
  })

})
