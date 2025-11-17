import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { EmployeeBenefit } from "@/models"
import BaseService from "@/services/base-service"

export type EmployeeBenefitCreationAttributes = Partial<CreationAttributes<EmployeeBenefit>>

export class CreateService extends BaseService {
  constructor(private attributes: EmployeeBenefitCreationAttributes) {
    super()
  }

  async perform(): Promise<EmployeeBenefit> {
    const {
      centreId,
      fiscalPeriodId,
      grossPayrollMonthlyActual,
      grossPayrollMonthlyEstimated,
      costCapPercentage,
      employeeCostActual,
      employeeCostEstimated,
      employerCostActual,
      employerCostEstimated,
      ...optionalAttributes
    } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    if (isNil(grossPayrollMonthlyActual)) {
      throw new Error("Gross payroll monthly actual is required")
    }

    if (isNil(grossPayrollMonthlyEstimated)) {
      throw new Error("Gross payroll monthly estimated is required")
    }

    if (isNil(costCapPercentage)) {
      throw new Error("Cost cap percentage is required")
    }

    if (isNil(employeeCostActual)) {
      throw new Error("Employee cost actual is required")
    }

    if (isNil(employeeCostEstimated)) {
      throw new Error("Employee cost estimated is required")
    }

    if (isNil(employerCostActual)) {
      throw new Error("Employer cost actual is required")
    }

    if (isNil(employerCostEstimated)) {
      throw new Error("Employer cost estimated is required")
    }

    const employeeBenefit = await EmployeeBenefit.create({
      ...optionalAttributes,
      centreId,
      fiscalPeriodId,
      grossPayrollMonthlyActual,
      grossPayrollMonthlyEstimated,
      costCapPercentage,
      employeeCostActual,
      employeeCostEstimated,
      employerCostActual,
      employerCostEstimated,
    })
    return employeeBenefit
  }
}

export default CreateService
