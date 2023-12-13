import { pick } from "lodash"
import { EmployeeBenefit } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class EmployeeBenefitSerializer extends BaseSerializer<EmployeeBenefit> {
  static asTable(employeeBenefits: EmployeeBenefit[]) {
    return employeeBenefits.map((employeeBenefit) => {
      return {
        ...pick(employeeBenefit, [
          "id",
          "centreId",
          "fiscalPeriodId",
          "grossPayrollMonthlyActual",
          "grossPayrollMonthlyEstimated",
          "costCapPercentage",
          "employeeCostActual",
          "employeeCostEstimated",
          "employerCostActual",
          "employerCostEstimated",
          "createdAt",
          "updatedAt",
        ]),
      }
    })
  }

  static asDetailed(employeeBenefit: EmployeeBenefit) {
    return {
      ...pick(employeeBenefit, [
        "id",
        "centreId",
        "fiscalPeriodId",
        "grossPayrollMonthlyActual",
        "grossPayrollMonthlyEstimated",
        "costCapPercentage",
        "employeeCostActual",
        "employeeCostEstimated",
        "employerCostActual",
        "employerCostEstimated",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default EmployeeBenefitSerializer
