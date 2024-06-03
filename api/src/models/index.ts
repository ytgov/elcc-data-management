import db from "@/db/db-client"

import { Centre } from "@/models/centre"
import { CentreFundingPeriod } from "@/models/centre-funding-period"
import { FundingSubmissionLineJson } from "@/models/funding-submission-line-json"
import { User } from "@/models/user"
import { UserRole } from "@/models/user-role"
import { Payment } from "@/models/payment"
import { EmployeeBenefit } from "@/models/employee-benefit"
import { EmployeeWageTier } from "@/models/employee-wage-tier"
import { WageEnhancement } from "@/models/wage-enhancement"

// Order matters here, though may be somewhat flexible
Centre.establishAssociations()
CentreFundingPeriod.establishAssociations()
FundingSubmissionLineJson.establishAssociations()
User.establishAssociations()
UserRole.establishAssociations()
Payment.establishAssociations()
EmployeeBenefit.establishAssociations()
EmployeeWageTier.establishAssociations()
WageEnhancement.establishAssociations()

// Alphabetically - order does not matter
export { FiscalPeriod } from "@/models/fiscal-period"
export { type FundingLineValue } from "@/models/funding-line-value"
export { FundingPeriod } from "@/models/funding-period"
export { FundingSubmissionLine } from "@/models/funding-submission-line"
export { Log } from "@/models/log"
export {
  Centre,
  CentreFundingPeriod,
  EmployeeBenefit,
  EmployeeWageTier,
  FundingSubmissionLineJson,
  Payment,
  User,
  UserRole,
  WageEnhancement,
}

// special db instance that has access to all models.
export default db
