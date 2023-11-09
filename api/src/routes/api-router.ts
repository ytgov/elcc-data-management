import { Router, type Request, type Response } from "express"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { PaymentsController } from "@/controllers"

export const apiRouter = Router()

// TODO: move all routing logic to this file, and move all route actions into controllers
apiRouter.use("/api", checkJwt)
apiRouter.use("/api", autheticateAndLoadUser)

apiRouter.get("/api/payments", PaymentsController.index)
apiRouter.post("/api/payments", PaymentsController.create)
apiRouter.patch("/api/payments/:paymentId", PaymentsController.update)
apiRouter.delete("/api/payments/:paymentId", PaymentsController.destroy)

apiRouter.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Api endpoint "${req.originalUrl}" not found` })
})
