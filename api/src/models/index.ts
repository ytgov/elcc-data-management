import db from "@/db/db-client"

import Centre from "@/models/centre"
import CentreFundingPeriod from "@/models/centre-funding-period"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"
import User from "@/models/user"
import UserRole from "@/models/user-role"
import Payment from "@/models/payment"
import EmployeeBenefit from "@/models/employee-benefit"

// Order matters here, though may be somewhat flexible
Centre.establishAssociations()
CentreFundingPeriod.establishAssociations()
FundingSubmissionLineJson.establishAssociations()
User.establishAssociations()
UserRole.establishAssociations()
Payment.establishAssociations()
EmployeeBenefit.establishAssociations()

// Alphabetically - order does not matter
// TODO: swap to named exports see https://github.com/icefoganalytics/travel-authorization/pull/126
export * from "@/models/centre-funding-period"
export * from "@/models/centre"
export { FiscalPeriod } from "@/models/fiscal-period"
export * from "@/models/funding-line-value"
export * from "@/models/funding-period"
export * from "@/models/funding-submission-line-json"
export * from "@/models/funding-submission-line"
export * from "@/models/log"
export * from "@/models/payment"
export * from "@/models/user-role"
export * from "@/models/user"
export { EmployeeBenefit }

// special db instance that has access to all models.
export default db
