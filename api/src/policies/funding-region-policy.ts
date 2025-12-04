import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingRegion, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class FundingRegionPolicy extends PolicyFactory(FundingRegion) {
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
    return ["region", "subsidyRate"]
  }

  permittedAttributesForCreate(): Path[] {
    return this.permittedAttributes()
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingRegion>> {
    return ALL_RECORDS_SCOPE
  }
}

export default FundingRegionPolicy
