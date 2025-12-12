import { isUndefined, pick } from "lodash"

import { BuildingExpenseCategory } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { FundingRegions } from "@/serializers"

export type BuildingExpenseCategoryAsIndex = Pick<
  BuildingExpenseCategory,
  "id" | "fundingRegionId" | "categoryName" | "subsidyRate" | "createdAt" | "updatedAt"
> & {
  fundingRegion: FundingRegions.AsReference
}

export class IndexSerializer extends BaseSerializer<BuildingExpenseCategory> {
  perform(): BuildingExpenseCategoryAsIndex {
    const { fundingRegion } = this.record
    if (isUndefined(fundingRegion)) {
      throw new Error("Expected funding region association to be pre-loaded.")
    }

    const fundingRegionAsReference = FundingRegions.ReferenceSerializer.perform(fundingRegion)

    return {
      ...pick(this.record, [
        "id",
        "fundingRegionId",
        "categoryName",
        "subsidyRate",
        "createdAt",
        "updatedAt",
      ]),
      fundingRegion: fundingRegionAsReference,
    }
  }
}

export default IndexSerializer
