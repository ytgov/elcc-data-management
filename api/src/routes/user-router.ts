import express, { type Request, type Response } from "express"
import { UserService } from "../services"
import { checkJwt, loadUser } from "../middleware/authz.middleware"
import { param } from "express-validator"
import { ReturnValidationErrors } from "../middleware"

export const userRouter = express.Router()

userRouter.use(checkJwt)
userRouter.use(loadUser)

const db = new UserService()

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user })
})

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await db.getAll()

  for (const user of users) {
    user.display_name = `${user.first_name} ${user.last_name}`
  }

  return res.json({ data: users })
})

userRouter.put(
  "/:email",
  [param("email").notEmpty().isString()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { email } = req.params
    const { roles, status, is_admin } = req.body

    const existing = await db.getByEmail(email)

    if (existing != null) {
      existing.status = status
      existing.roles = roles
      existing.is_admin = is_admin

      await db.update(email, existing)

      return res.json({
        messages: [{ variant: "success", text: "User saved" }],
      })
    }

    res.status(404).send()
  }
)
