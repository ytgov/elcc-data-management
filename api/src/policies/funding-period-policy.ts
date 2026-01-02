import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingPeriod, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class FundingPeriodPolicy extends PolicyFactory(FundingPeriod) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["fromDate", "toDate", "title"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["fiscalYear", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingPeriod>> {
    return ALL_RECORDS_SCOPE
  }
}

export default FundingPeriodPolicy
