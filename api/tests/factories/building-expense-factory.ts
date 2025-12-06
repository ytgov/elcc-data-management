import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { BuildingExpense } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

import buildingExpenseCategoryFactory from "@/factories/building-expense-category-factory"
import centreFactory from "@/factories/centre-factory"
import fiscalPeriodFactory from "@/factories/fiscal-period-factory"

export const buildingExpenseFactory = Factory.define<BuildingExpense>(
  ({ associations, params, onCreate }) => {
    onCreate(async (buildingExpense) => {
      try {
        await nestedSaveAndAssociateIfNew(buildingExpense)
        return buildingExpense
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create BuildingExpense with attributes: ${JSON.stringify(buildingExpense.dataValues, null, 2)}`
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

    const category =
      associations.category ??
      buildingExpenseCategoryFactory.build({
        id: params.buildingExpenseCategoryId,
      })

    const subsidyRate = faker.finance.amount({ min: 0.01, max: 0.5, dec: 4 })
    const buildingUsagePercent = faker.finance.amount({ min: 0, max: 100, dec: 2 })
    const estimatedCost = faker.finance.amount({ min: 100, max: 10000, dec: 4 })
    const actualCost = faker.finance.amount({ min: 100, max: 10000, dec: 4 })
    const totalCost = faker.finance.amount({ min: 10, max: 5000, dec: 4 })

    const buildingExpense = BuildingExpense.build({
      centreId: centre.id,
      fiscalPeriodId: fiscalPeriod.id,
      buildingExpenseCategoryId: category.id,
      subsidyRate,
      buildingUsagePercent,
      estimatedCost,
      actualCost,
      totalCost,
    })

    buildingExpense.centre = centre
    buildingExpense.fiscalPeriod = fiscalPeriod
    buildingExpense.category = category

    return buildingExpense
  }
)

export default buildingExpenseFactory
