import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { BuildingExpenseCategory, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class BuildingExpenseCategoryPolicy extends PolicyFactory(BuildingExpenseCategory) {
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
    return ["categoryName", "subsidyRate"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["fundingRegionId", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<BuildingExpenseCategory>> {
    return ALL_RECORDS_SCOPE
  }
}

export default BuildingExpenseCategoryPolicy
