import db from "@/db/db-client"

import Centre from "@/models/centre"
import CentreFundingPeriod from "@/models/centre-funding-period"
import FundingSubmissionLine from "@/models/funding-submission-line"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"
import FundingSubmissionLineValue from "@/models/funding-submission-line-value"
import User from "@/models/user"
import UserRole from "@/models/user-role"

Centre.establishasAssociations()
CentreFundingPeriod.establishasAssociations()
FundingSubmissionLine.establishasAssociations()
FundingSubmissionLineJson.establishasAssociations()
FundingSubmissionLineValue.establishAssociations()
User.establishasAssociations()
UserRole.establishasAssociations()

export * from "@/models/centre-funding-period"
export * from "@/models/centre"
export * from "@/models/funding-line-value"
export * from "@/models/funding-period"
export * from "@/models/funding-submission-line-json"
export * from "@/models/funding-submission-line-value"
export * from "@/models/funding-submission-line"
export * from "@/models/log"
export * from "@/models/user-role"
export * from "@/models/user"

// special db instance that has access to all models.
export default db
