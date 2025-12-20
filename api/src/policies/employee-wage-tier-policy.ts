import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { EmployeeWageTier, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class EmployeeWageTierPolicy extends PolicyFactory(EmployeeWageTier) {
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
    return ["tierLabel", "wageRatePerHour"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["fiscalPeriodId", "tierLevel", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<EmployeeWageTier>> {
    return ALL_RECORDS_SCOPE
  }
}

export default EmployeeWageTierPolicy
