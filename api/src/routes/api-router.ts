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
apiRouter.use("/api", checkJwt, autheticateAndLoadUser)

apiRouter.route("/api/payments").get(PaymentsController.index).post(PaymentsController.create)
apiRouter
  .route("/api/payments/:paymentId")
  .get(PaymentsController.show)
  .patch(PaymentsController.update)
  .delete(PaymentsController.destroy)

apiRouter
  .route("/api/funding-submission-line-jsons")
  .get(FundingSubmissionLineJsonsController.index)
  .post(FundingSubmissionLineJsonsController.create)
apiRouter
  .route("/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId")
  .get(FundingSubmissionLineJsonsController.show)
  .patch(FundingSubmissionLineJsonsController.update)
  .delete(FundingSubmissionLineJsonsController.destroy)

apiRouter.route("/api/fiscal-periods").get(FiscalPeriodsController.index)

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
