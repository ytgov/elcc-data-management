import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingPeriod, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class FundingPeriodPolicy extends PolicyFactory(FundingPeriod) {
  show(): boolean {
    return true
  }

  create(): boolean {
    return true
  }

  update(): boolean {
    return true
  }

  destroy(): boolean {
    return true
  }

  permittedAttributes(): Path[] {
    return ["fromDate", "toDate", "title"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["fiscalYear", "isFiscalYear", "isSchoolMonth", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingPeriod>> {
    return {}
  }
}

export default FundingPeriodPolicy
