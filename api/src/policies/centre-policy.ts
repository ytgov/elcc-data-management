import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { Centre, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class CentrePolicy extends PolicyFactory(Centre) {
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
    return [
      "name",
      "license",
      "community",
      "region",
      "isFirstNationProgram",
      "status",
      "hotMeal",
      "licensedFor",
      "buildingUsagePercent",
      "lastSubmission",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return this.permittedAttributes()
  }

  static policyScope(_user: User): FindOptions<Attributes<Centre>> {
    return ALL_RECORDS_SCOPE
  }
}

export default CentrePolicy
