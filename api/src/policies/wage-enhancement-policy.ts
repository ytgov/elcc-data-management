import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { WageEnhancement, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class WageEnhancementPolicy extends PolicyFactory(WageEnhancement) {
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
    return ["employeeName", "hoursEstimated", "hoursActual"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["centreId", "employeeWageTierId", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<WageEnhancement>> {
    return ALL_RECORDS_SCOPE
  }
}

export default WageEnhancementPolicy
