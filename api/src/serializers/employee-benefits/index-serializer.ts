import { pick } from "lodash"

import { EmployeeBenefit } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type EmployeeBenefitIndexView = Pick<
  EmployeeBenefit,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "grossPayrollMonthlyActual"
  | "grossPayrollMonthlyEstimated"
  | "costCapPercentage"
  | "employeeCostActual"
  | "employeeCostEstimated"
  | "employerCostActual"
  | "employerCostEstimated"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<EmployeeBenefit> {
  perform(): EmployeeBenefitIndexView {
    return {
      ...pick(this.record, [
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

export default IndexSerializer
