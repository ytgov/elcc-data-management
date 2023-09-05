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
export * from "@/models/funding-period"
export * from "@/models/funding-submission-line-json"
export * from "@/models/funding-submission-line-value"
export * from "@/models/funding-submission-line"
export * from "@/models/log"
export * from "@/models/user-role"
export * from "@/models/user"

// I want to keep default exports to encourage the "single thing per file" principle
// you can still access the model bundle via import * as models from "@/models"
// but import models from "@/models" will be undefined
// Its not ideal, but it's hopefully the best of both worlds?
// Avoids leaking random last default export from model files
export default undefined
