import { mockCurrentUser, request } from "@/support"
import { userFactory } from "@/factories"
import { User } from "@/models"

describe("api/src/controllers/users-controller.ts", () => {
  describe("UsersController", () => {
    let currentUser: User

    beforeEach(async () => {
      currentUser = await userFactory.create({
        roles: [User.Roles.SYSTEM_ADMINISTRATOR],
      })

      mockCurrentUser(currentUser)
    })

    describe("#index -> GET /api/users", () => {
      test("when users exist, returns users array", async () => {
        await userFactory.createList(2)

        const response = await request()
          .get("/api/users")
          .expect("Content-Type", /json/)
          .expect(200)

        expect(response.body.users.length).toBeGreaterThanOrEqual(2)
      })

      test("when users exist, returns total count", async () => {
        await userFactory.createList(2)

        const response = await request()
          .get("/api/users")
          .expect("Content-Type", /json/)
          .expect(200)

        expect(response.body.totalCount).toBeGreaterThanOrEqual(2)
      })
    })

    describe("#show -> GET /api/users/:userId", () => {
      test("when user exists, returns a specific user", async () => {
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

      test("when user does not exist, returns 404", async () => {
        const response = await request()
          .get("/api/users/999999")
          .expect("Content-Type", /json/)
          .expect(404)

        expect(response.body.message).toContain("User not found")
      })
    })

    describe("#create -> POST /api/users", () => {
      test("when valid data is provided, returns the created user", async () => {
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

      test("when valid data is provided, persists the user to the database", async () => {
        const userData = {
          email: "anotheruser@example.com",
          sub: "auth0|anotheruser123",
          firstName: "Another",
          lastName: "User",
          roles: [User.Roles.USER],
          status: User.Status.ACTIVE,
        }

        await request().post("/api/users").send(userData).expect("Content-Type", /json/).expect(201)

        expect(await User.findOne({ where: { email: userData.email } })).not.toBeNull()
      })
    })

    describe("#update -> PATCH /api/users/:userId", () => {
      test("when valid updates are provided, returns the updated user", async () => {
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

      test("when valid updates are provided, persists the updates to the database", async () => {
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

      test("when user does not exist, returns 404", async () => {
        const response = await request()
          .patch("/api/users/999999")
          .send({ firstName: "Test" })
          .expect("Content-Type", /json/)
          .expect(404)

        expect(response.body.message).toContain("User not found")
      })
    })

    describe("#destroy -> DELETE /api/users/:userId", () => {
      test("when user exists, returns 204 status", async () => {
        const user = await userFactory.create()

        await request().delete(`/api/users/${user.id}`).expect(204)
      })

      test("when user exists, removes user from database", async () => {
        const user = await userFactory.create()

        await request().delete(`/api/users/${user.id}`).expect(204)

        expect(await User.findByPk(user.id)).toBeNull()
      })

      test("when user does not exist, returns 404", async () => {
        const response = await request()
          .delete("/api/users/999999")
          .expect("Content-Type", /json/)
          .expect(404)

        expect(response.body.message).toContain("User not found")
      })
    })
  })
})
