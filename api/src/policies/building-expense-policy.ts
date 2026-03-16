import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { BuildingExpense, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class BuildingExpensePolicy extends PolicyFactory(BuildingExpense) {
  show(): boolean {
    return true
  }

  create(): boolean {
    return true
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
    const permittedAttributes: Path[] = ["estimatedCost", "actualCost", "totalCost", "notes"]

    if (this.user.isSystemAdmin) {
      permittedAttributes.push("subsidyRate")
    }

    return permittedAttributes
  }

  permittedAttributesForCreate(): Path[] {
    return [
      "centreId",
      "fiscalPeriodId",
      "categoryId",
      ...this.permittedAttributes(),
      // option flags
      "applyToCurrentAndFutureFiscalPeriods",
    ]
  }

  static policyScope(_user: User): FindOptions<Attributes<BuildingExpense>> {
    return ALL_RECORDS_SCOPE
  }
}

export default BuildingExpensePolicy
