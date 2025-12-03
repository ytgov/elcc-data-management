import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingReconciliation, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class FundingReconciliationPolicy extends PolicyFactory(FundingReconciliation) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    return true
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin && this.record.isDraftState) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["notes"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["centreId", "fundingPeriodId"]
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingReconciliation>> {
    return ALL_RECORDS_SCOPE
  }
}

export default FundingReconciliationPolicy
