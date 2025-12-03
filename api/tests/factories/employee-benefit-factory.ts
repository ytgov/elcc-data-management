import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { EmployeeBenefit } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

import centreFactory from "@/factories/centre-factory"
import fiscalPeriodFactory from "@/factories/fiscal-period-factory"

export const employeeBenefitFactory = Factory.define<EmployeeBenefit>(
  ({ associations, params, onCreate }) => {
    onCreate(async (employeeBenefit) => {
      try {
        await nestedSaveAndAssociateIfNew(employeeBenefit)
        return employeeBenefit
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create EmployeeBenefit with attributes: ${JSON.stringify(employeeBenefit.dataValues, null, 2)}`
        )
      }
    })

    const centre =
      associations.centre ??
      centreFactory.build({
        id: params.centreId,
      })

    const fiscalPeriod =
      associations.fiscalPeriod ??
      fiscalPeriodFactory.build({
        id: params.fiscalPeriodId,
      })

    const grossPayrollMonthlyActual = faker.finance.amount({ min: 1000, max: 50000 })
    const grossPayrollMonthlyEstimated = faker.finance.amount({ min: 1000, max: 50000 })
    const costCapPercentage = faker.finance.amount({ min: 0.01, max: 0.5 })
    const employeeCostActual = faker.finance.amount({ min: 100, max: 10000 })
    const employeeCostEstimated = faker.finance.amount({ min: 100, max: 10000 })
    const employerCostActual = faker.finance.amount({ min: 100, max: 10000 })
    const employerCostEstimated = faker.finance.amount({ min: 100, max: 10000 })

    const employeeBenefit = EmployeeBenefit.build({
      centreId: centre.id,
      fiscalPeriodId: fiscalPeriod.id,
      grossPayrollMonthlyActual,
      grossPayrollMonthlyEstimated,
      costCapPercentage,
      employeeCostActual,
      employeeCostEstimated,
      employerCostActual,
      employerCostEstimated,
    })

    employeeBenefit.centre = centre
    employeeBenefit.fiscalPeriod = fiscalPeriod

    return employeeBenefit
  }
)

export default employeeBenefitFactory
