import { Router } from "express"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { PaymentsController } from "@/controllers"

export const apiRouter = Router()

// TODO: move all routing logic to this file, and move all route actions into controllers
apiRouter.use("/api", checkJwt)
apiRouter.use("/api", autheticateAndLoadUser)

apiRouter.get("/api/payments", PaymentsController.index)
