import { pick } from "lodash"

import { BuildingExpenseCategory } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type BuildingExpenseCategoryAsReference = Pick<
  BuildingExpenseCategory,
  "id" | "fundingRegionId" | "categoryName" | "subsidyRate" | "createdAt" | "updatedAt"
>

export class ReferenceSerializer extends BaseSerializer<BuildingExpenseCategory> {
  perform(): BuildingExpenseCategoryAsReference {
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

export default ReferenceSerializer
