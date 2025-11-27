export { type FundingLineValue } from "@/models/funding-line-value"

import db from "@/db/db-client"

import Centre from "@/models/centre"
import EmployeeBenefit from "@/models/employee-benefit"
import EmployeeWageTier from "@/models/employee-wage-tier"
import FiscalPeriod from "@/models/fiscal-period"
import FundingPeriod from "@/models/funding-period"
import FundingReconciliation from "@/models/funding-reconciliation"
import FundingReconciliationAdjustment from "@/models/funding-reconciliation-adjustment"
import FundingSubmissionLine from "@/models/funding-submission-line"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"
import Log from "@/models/log"
import Payment from "@/models/payment"
import User from "@/models/user"
import WageEnhancement from "@/models/wage-enhancement"

db.addModels([
  Centre,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
  Log,
  Payment,
  User,
  WageEnhancement,
])

Centre.establishScopes()
EmployeeBenefit.establishScopes()
EmployeeWageTier.establishScopes()
FiscalPeriod.establishScopes()
FundingPeriod.establishScopes()
FundingReconciliation.establishScopes()
FundingReconciliationAdjustment.establishScopes()
FundingSubmissionLine.establishScopes()
FundingSubmissionLineJson.establishScopes()
Log.establishScopes()
Payment.establishScopes()
User.establishScopes()
WageEnhancement.establishScopes()

export {
  Centre,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
  Log,
  Payment,
  User,
  WageEnhancement,
}

// special db instance that has access to all models.
export default db
