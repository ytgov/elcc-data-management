import db from "@/db/db-client"

import Centre from "@/models/centre"
import CentreFundingPeriod from "@/models/centre-funding-period"
import EmployeeBenefit from "@/models/employee-benefit"
import EmployeeWageTier from "@/models/employee-wage-tier"
import FiscalPeriod from "@/models/fiscal-period"
import { FundingSubmissionLineJson } from "@/models/funding-submission-line-json"
import { User } from "@/models/user"
import { UserRole } from "@/models/user-role"
import { Payment } from "@/models/payment"
import { WageEnhancement } from "@/models/wage-enhancement"

db.addModels([
  Centre,
  CentreFundingPeriod,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
])

// Order matters here, though may be somewhat flexible
Centre.establishScopes()
CentreFundingPeriod.establishScopes()
EmployeeBenefit.establishScopes()
EmployeeWageTier.establishScopes()
FiscalPeriod.establishScopes()
FundingSubmissionLineJson.establishAssociations()
User.establishAssociations()
UserRole.establishAssociations()
Payment.establishAssociations()
WageEnhancement.establishAssociations()

// Alphabetically - order does not matter
export { type FundingLineValue } from "@/models/funding-line-value"
export { FundingPeriod } from "@/models/funding-period"
export { FundingSubmissionLine } from "@/models/funding-submission-line"
export { Log } from "@/models/log"
export {
  Centre,
  CentreFundingPeriod,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingSubmissionLineJson,
  Payment,
  User,
  UserRole,
  WageEnhancement,
}

// special db instance that has access to all models.
export default db
