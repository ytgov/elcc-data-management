import { isUndefined, pick } from "lodash"

import { type PolicyAsReference } from "@/policies/base-policy"
import { BuildingExpense, type User } from "@/models"
import { BuildingExpensePolicy } from "@/policies"
import BaseSerializer from "@/serializers/base-serializer"
import { BuildingExpenseCategories } from "@/serializers"

export type BuildingExpenseAsIndex = Pick<
  BuildingExpense,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "categoryId"
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
  policy: PolicyAsReference
}

export class IndexSerializer extends BaseSerializer<BuildingExpense> {
  constructor(
    protected record: BuildingExpense,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): BuildingExpenseAsIndex {
    const { category } = this.record
    if (isUndefined(category)) {
      throw new Error("Expected category association to be preloaded.")
    }

    const categorySerialized = BuildingExpenseCategories.ReferenceSerializer.perform(category)
    const serializedPolicy = this.serializePolicy(this.record, this.currentUser)

    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fiscalPeriodId",
        "categoryId",
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
      policy: serializedPolicy,
    }
  }

  private serializePolicy(record: BuildingExpense, currentUser: User): PolicyAsReference {
    return new BuildingExpensePolicy(currentUser, record).toJSON()
  }
}

export default IndexSerializer
