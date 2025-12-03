import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingReconciliationAdjustment, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class FundingReconciliationAdjustmentPolicy extends PolicyFactory(FundingReconciliationAdjustment) {
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
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return [
      "fundingReceivedPeriodAmount",
      "eligibleExpensesPeriodAmount",
      "payrollAdjustmentsPeriodAmount",
      "cumulativeBalanceAmount",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return [
      "fundingReconciliationId",
      "fiscalPeriodId",
      "fundingReceivedPeriodAmount",
      "eligibleExpensesPeriodAmount",
      "payrollAdjustmentsPeriodAmount",
      "cumulativeBalanceAmount",
    ]
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingReconciliationAdjustment>> {
    return ALL_RECORDS_SCOPE
  }
}

export default FundingReconciliationAdjustmentPolicy
