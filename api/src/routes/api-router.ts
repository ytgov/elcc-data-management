import { DatabaseError } from "@sequelize/core"
import {
  Router,
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express"
import { UnauthorizedError } from "express-jwt"

import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import {
  CentresController,
  EmployeeBenefitsController,
  EmployeeWageTiersController,
  FiscalPeriodsController,
  FundingSubmissionLineJsons,
  FundingSubmissionLineJsonsController,
  PaymentsController,
  WageEnhancements,
  WageEnhancementsController,
} from "@/controllers"

export const apiRouter = Router()

// TODO: move all routing logic to this file, and move all route actions into controllers
apiRouter.use("/api", checkJwt, autheticateAndLoadUser)

apiRouter.route("/api/centres").post(CentresController.create)
apiRouter.route("/api/centres/:centreId").patch(CentresController.update)

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
apiRouter
  .route("/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId/replicate-estimates")
  .post(FundingSubmissionLineJsons.ReplicateEstimatesController.create)

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

apiRouter.route("/api/employee-wage-tiers").get(EmployeeWageTiersController.index)

apiRouter
  .route("/api/wage-enhancements")
  .get(WageEnhancementsController.index)
  .post(WageEnhancementsController.create)
apiRouter
  .route("/api/wage-enhancements/:wageEnhancementId")
  .get(WageEnhancementsController.show)
  .patch(WageEnhancementsController.update)
  .delete(WageEnhancementsController.destroy)
apiRouter
  .route("/api/wage-enhancements/replicate-estimates")
  .post(WageEnhancements.ReplicateEstimatesController.create)

// if no other routes match, return a 404
apiRouter.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Api endpoint "${req.originalUrl}" not found` })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
apiRouter.use(
  "/api",
  (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }

    if (err instanceof UnauthorizedError) {
      console.error(err)
      return res.status(err.status).json({ message: err.inner.message })
    }

    if (err instanceof DatabaseError) {
      console.error(err)
      return res.status(422).json({ message: "Invalid query against database." })
    }

    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
)
