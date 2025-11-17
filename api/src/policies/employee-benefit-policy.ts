import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"

import { EmployeeBenefit, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class EmployeeBenefitPolicy extends PolicyFactory(EmployeeBenefit) {
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
    return [
      "grossPayrollMonthlyActual",
      "grossPayrollMonthlyEstimated",
      "costCapPercentage",
      "employeeCostActual",
      "employeeCostEstimated",
      "employerCostActual",
      "employerCostEstimated",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return ["centreId", "fiscalPeriodId", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<EmployeeBenefit>> {
    return ALL_RECORDS_SCOPE
  }
}

export default EmployeeBenefitPolicy
