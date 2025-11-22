import { pick } from "lodash"

import { EmployeeBenefit } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type EmployeeBenefitAsShow = Pick<
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

export class ShowSerializer extends BaseSerializer<EmployeeBenefit> {
  perform(): EmployeeBenefitAsShow {
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

export default ShowSerializer
