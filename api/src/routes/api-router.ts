import { Router, type Request, type Response } from "express"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import {
  EmployeeBenefitsController,
  FiscalPeriodsController,
  FundingSubmissionLineJsonsController,
  PaymentsController,
} from "@/controllers"

export const apiRouter = Router()

// TODO: move all routing logic to this file, and move all route actions into controllers
apiRouter.use("/api", checkJwt)
apiRouter.use("/api", autheticateAndLoadUser)

apiRouter.get("/api/payments", PaymentsController.index)
apiRouter.post("/api/payments", PaymentsController.create)
apiRouter.patch("/api/payments/:paymentId", PaymentsController.update)
apiRouter.delete("/api/payments/:paymentId", PaymentsController.destroy)

apiRouter.get("/api/funding-submission-line-jsons", FundingSubmissionLineJsonsController.index)
apiRouter.post("/api/funding-submission-line-jsons", FundingSubmissionLineJsonsController.create)
apiRouter.get(
  "/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId",
  FundingSubmissionLineJsonsController.show
)
apiRouter.patch(
  "/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId",
  FundingSubmissionLineJsonsController.update
)
apiRouter.delete(
  "/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId",
  FundingSubmissionLineJsonsController.destroy
)

apiRouter.get("/api/fiscal-periods", FiscalPeriodsController.index)

apiRouter
  .route("/api/employee-benefits")
  .get(EmployeeBenefitsController.index)
  .post(EmployeeBenefitsController.create)
apiRouter
  .route("/api/employee-benefits/:employeeBenefitId")
  .get(EmployeeBenefitsController.show)
  .patch(EmployeeBenefitsController.update)
  .delete(EmployeeBenefitsController.destroy)

apiRouter.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Api endpoint "${req.originalUrl}" not found` })
})
