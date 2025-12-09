import { pick } from "lodash"

import { BuildingExpense } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type BuildingExpenseAsShow = Pick<
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
>

export class ShowSerializer extends BaseSerializer<BuildingExpense> {
  perform(): BuildingExpenseAsShow {
    return pick(this.record, [
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
    ])
  }
}

export default ShowSerializer
