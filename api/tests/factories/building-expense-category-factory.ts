import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { BuildingExpenseCategory } from "@/models"

import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

import fundingRegionFactory from "@/factories/funding-region-factory"

export const buildingExpenseCategoryFactory = Factory.define<BuildingExpenseCategory>(
  ({ sequence, params, associations, onCreate }) => {
    onCreate(async (buildingExpenseCategory) => {
      try {
        await nestedSaveAndAssociateIfNew(buildingExpenseCategory)
        return buildingExpenseCategory
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create BuildingExpenseCategory with attributes: ${JSON.stringify(buildingExpenseCategory.dataValues, null, 2)}`
        )
      }
    })

    const fundingRegion =
      associations.fundingRegion ??
      fundingRegionFactory.build({
        id: params.fundingRegionId,
      })

    const categoryName =
      params.categoryName ??
      faker.helpers.arrayElement([
        "Rent or Mortgage",
        "Phone",
        "Internet",
        "Cell Phone",
        "Security",
        "Electric",
        "Fuel",
        "Garbage",
        "Snow Removal",
        "Water/Sewer/Taxes",
        "Insurance",
        "Janitorial",
        "Cleaning Supplies",
        "Minor Repairs",
      ]) + `-${sequence}`

    const subsidyRate = faker.finance.amount({ min: 0.01, max: 0.5, dec: 4 })

    const buildingExpenseCategory = BuildingExpenseCategory.build({
      fundingRegionId: fundingRegion.id,
      categoryName,
      subsidyRate,
    })

    buildingExpenseCategory.fundingRegion = fundingRegion

    return buildingExpenseCategory
  }
)

export default buildingExpenseCategoryFactory
