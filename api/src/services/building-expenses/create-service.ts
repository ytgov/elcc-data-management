import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { BuildingExpense, User } from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseCreationAttributes = Partial<CreationAttributes<BuildingExpense>>

export class CreateService extends BaseService {
  constructor(
    private attributes: BuildingExpenseCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense> {
    const {
      centreId,
      fiscalPeriodId,
      buildingExpenseCategoryId,
      subsidyRate,
      buildingUsagePercent,
      estimatedCost,
      actualCost,
      totalCost,
      ...optionalAttributes
    } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    if (isNil(buildingExpenseCategoryId)) {
      throw new Error("Building expense category ID is required")
    }

    if (isNil(subsidyRate)) {
      throw new Error("Subsidy rate is required")
    }

    if (isNil(buildingUsagePercent)) {
      throw new Error("Building usage percent is required")
    }

    if (isNil(estimatedCost)) {
      throw new Error("Estimated cost is required")
    }

    if (isNil(actualCost)) {
      throw new Error("Actual cost is required")
    }

    if (isNil(totalCost)) {
      throw new Error("Total cost is required")
    }

    const buildingExpense = await BuildingExpense.create({
      ...optionalAttributes,
      centreId,
      fiscalPeriodId,
      buildingExpenseCategoryId,
      subsidyRate,
      buildingUsagePercent,
      estimatedCost,
      actualCost,
      totalCost,
    })

    return buildingExpense
  }
}

export default CreateService
