import { pick } from "lodash"

import { BuildingExpense } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type BuildingExpenseAsIndex = Pick<
  BuildingExpense,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "buildingExpenseCategoryId"
  | "subsidyRate"
  | "buildingUsagePercent"
  | "estimatedCost"
  | "actualCost"
  | "totalCost"
  | "notes"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<BuildingExpense> {
  perform(): BuildingExpenseAsIndex {
    return pick(this.record, [
      "id",
      "centreId",
      "fiscalPeriodId",
      "buildingExpenseCategoryId",
      "subsidyRate",
      "buildingUsagePercent",
      "estimatedCost",
      "actualCost",
      "totalCost",
      "notes",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default IndexSerializer
