import { isNil } from "lodash"
import express, { type Request, type Response } from "express"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { param } from "express-validator"
import { ReturnValidationErrors } from "@/middleware"

import { User } from "@/models"
import { UserServices } from "@/services/user-services"
import { UserSerializer } from "@/serializers"

export const userRouter = express.Router()

userRouter.use(checkJwt)
userRouter.use(autheticateAndLoadUser)

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user })
})

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await User.findAll()

  const serializedUsers = UserSerializer.serialize(users, { view: "default" })

  return res.json({ data: serializedUsers })
})

userRouter.put(
  "/:email",
  [param("email").notEmpty().isString()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { email } = req.params
    const { roles, status, isAdmin } = req.body

    const user = await User.findByPk(email, { include: ["roles"] })

    if (isNil(user)) return res.status(404).send()

    return UserServices.update(user, { roles, status, isAdmin }).then((updatedUser) => {
      return res.json({
        user: updatedUser,
        messages: [{ variant: "success", text: "User saved" }],
      })
    })
  }
)
