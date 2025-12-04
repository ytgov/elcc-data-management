import { pick } from "lodash"

import { BuildingExpenseCategory } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type BuildingExpenseCategoryAsIndex = Pick<
  BuildingExpenseCategory,
  "id" | "fundingRegionId" | "categoryName" | "subsidyRate" | "createdAt" | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<BuildingExpenseCategory> {
  perform(): BuildingExpenseCategoryAsIndex {
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

export default IndexSerializer
