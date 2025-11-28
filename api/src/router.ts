import { DatabaseError } from "@sequelize/core"
import {
  Router,
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express"
import { UnauthorizedError } from "express-jwt"

import { GIT_COMMIT_HASH, RELEASE_TAG } from "@/config"
import { checkJwt, autheticateAndLoadUser } from "@/middleware/authz.middleware"
import { centreRouter, fundingPeriodRouter, submissionLineRouter } from "@/routes"

import {
  CentresController,
  CurrentUserController,
  EmployeeBenefitsController,
  EmployeeWageTiersController,
  FiscalPeriodsController,
  FundingPeriodsController,
  FundingReconciliations,
  FundingReconciliationsController,
  FundingSubmissionLineJsons,
  FundingSubmissionLineJsonsController,
  FundingSubmissionLinesController,
  PaymentsController,
  UsersController,
  WageEnhancements,
  WageEnhancementsController,
} from "@/controllers"
import { FundingReconciliationAdjustmentsController } from "@/controllers/funding-reconciliation-adjustments-controller"

export const router = Router()

router.route("/_status").get((_req: Request, res: Response) => {
  res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// TODO: replace legacy routes with newer style
router.use("/api/centre", checkJwt, autheticateAndLoadUser, centreRouter)
router.use("/api/funding-period", fundingPeriodRouter)
router.use("/api/submission-line", submissionLineRouter)

// TODO: move all routing logic to this file, and move all route actions into controllers
router.use("/api", checkJwt, autheticateAndLoadUser)

router.route("/api/current-user").get(CurrentUserController.show)

router.route("/api/centres").post(CentresController.create)
router.route("/api/centres/:centreId").patch(CentresController.update)

router
  .route("/api/employee-benefits")
  .get(EmployeeBenefitsController.index)
  .post(EmployeeBenefitsController.create)
router
  .route("/api/employee-benefits/:employeeBenefitId")
  .get(EmployeeBenefitsController.show)
  .patch(EmployeeBenefitsController.update)
  .delete(EmployeeBenefitsController.destroy)

router.route("/api/employee-wage-tiers").get(EmployeeWageTiersController.index)

router.route("/api/fiscal-periods").get(FiscalPeriodsController.index)

router
  .route("/api/funding-periods")
  .get(FundingPeriodsController.index)
  .post(FundingPeriodsController.create)
router
  .route("/api/funding-periods/:fundingPeriodId")
  .get(FundingPeriodsController.show)
  .patch(FundingPeriodsController.update)
  .delete(FundingPeriodsController.destroy)

router
  .route("/api/funding-reconciliations")
  .get(FundingReconciliationsController.index)
  .post(FundingReconciliationsController.create)
router
  .route("/api/funding-reconciliations/:fundingReconciliationId")
  .get(FundingReconciliationsController.show)
  .patch(FundingReconciliationsController.update)
  .delete(FundingReconciliationsController.destroy)
router
  .route("/api/funding-reconciliations/:fundingReconciliationId/refresh")
  .post(FundingReconciliations.RefreshController.create)

router
  .route("/api/funding-reconciliation-adjustments")
  .get(FundingReconciliationAdjustmentsController.index)
  .post(FundingReconciliationAdjustmentsController.create)
router
  .route("/api/funding-reconciliation-adjustments/:fundingReconciliationAdjustmentId")
  .get(FundingReconciliationAdjustmentsController.show)
  .patch(FundingReconciliationAdjustmentsController.update)
  .delete(FundingReconciliationAdjustmentsController.destroy)

router
  .route("/api/funding-submission-line-jsons")
  .get(FundingSubmissionLineJsonsController.index)
  .post(FundingSubmissionLineJsonsController.create)
router
  .route("/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId")
  .get(FundingSubmissionLineJsonsController.show)
  .patch(FundingSubmissionLineJsonsController.update)
  .delete(FundingSubmissionLineJsonsController.destroy)
router
  .route("/api/funding-submission-line-jsons/:fundingSubmissionLineJsonId/replicate-estimates")
  .post(FundingSubmissionLineJsons.ReplicateEstimatesController.create)

router
  .route("/api/funding-submission-lines")
  .get(FundingSubmissionLinesController.index)
  .post(FundingSubmissionLinesController.create)
router
  .route("/api/funding-submission-lines/:fundingSubmissionLineId")
  .get(FundingSubmissionLinesController.show)
  .patch(FundingSubmissionLinesController.update)
  .delete(FundingSubmissionLinesController.destroy)

router.route("/api/payments").get(PaymentsController.index).post(PaymentsController.create)
router
  .route("/api/payments/:paymentId")
  .get(PaymentsController.show)
  .patch(PaymentsController.update)
  .delete(PaymentsController.destroy)

router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:userId")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

router
  .route("/api/wage-enhancements")
  .get(WageEnhancementsController.index)
  .post(WageEnhancementsController.create)
router
  .route("/api/wage-enhancements/:wageEnhancementId")
  .get(WageEnhancementsController.show)
  .patch(WageEnhancementsController.update)
  .delete(WageEnhancementsController.destroy)
router
  .route("/api/wage-enhancements/replicate-estimates")
  .post(WageEnhancements.ReplicateEstimatesController.create)

// if no other routes match, return a 404
router.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Api endpoint "${req.originalUrl}" not found` })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
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
})

export default router
