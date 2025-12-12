import { pick } from "lodash"

import { BuildingExpenseCategory } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type BuildingExpenseCategoryAsShow = Pick<
  BuildingExpenseCategory,
  "id" | "fundingRegionId" | "categoryName" | "subsidyRate" | "createdAt" | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<BuildingExpenseCategory> {
  perform(): BuildingExpenseCategoryAsShow {
    return pick(this.record, [
      "id",
      "fundingRegionId",
      "categoryName",
      "subsidyRate",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default ShowSerializer
