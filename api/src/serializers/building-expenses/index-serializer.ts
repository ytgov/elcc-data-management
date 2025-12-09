import { isUndefined, pick } from "lodash"

import { BuildingExpense } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { BuildingExpenseCategories } from "@/serializers"

export type BuildingExpenseAsIndex = Pick<
  BuildingExpense,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "buildingExpenseCategoryId"
  | "fundingRegionSnapshot"
  | "subsidyRate"
  | "buildingUsagePercent"
  | "estimatedCost"
  | "actualCost"
  | "totalCost"
  | "notes"
  | "createdAt"
  | "updatedAt"
> & {
  category: BuildingExpenseCategories.AsReference
}

export class IndexSerializer extends BaseSerializer<BuildingExpense> {
  perform(): BuildingExpenseAsIndex {
    const { category } = this.record
    if (isUndefined(category)) {
      throw new Error("Expected category association to be preloaded.")
    }

    const categorySerialized = BuildingExpenseCategories.ReferenceSerializer.perform(category)

    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fiscalPeriodId",
        "buildingExpenseCategoryId",
        "fundingRegionSnapshot",
        "subsidyRate",
        "buildingUsagePercent",
        "estimatedCost",
        "actualCost",
        "totalCost",
        "notes",
        "createdAt",
        "updatedAt",
      ]),
      category: categorySerialized,
    }
  }
}

export default IndexSerializer
