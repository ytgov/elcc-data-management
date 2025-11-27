import { isUndefined, pick } from "lodash"

import { FundingReconciliation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { FundingReconciliationAdjustments } from "@/serializers"

export type FundingReconciliationAsShow = Pick<
  FundingReconciliation,
  | "id"
  | "centreId"
  | "fundingPeriodId"
  | "status"
  | "fundingReceivedTotalAmount"
  | "eligibleExpensesTotalAmount"
  | "payrollAdjustmentsTotalAmount"
  | "finalBalanceAmount"
  | "notes"
  | "finalizedAt"
  | "finalizedById"
  | "createdAt"
  | "updatedAt"
> & {
  adjustments: FundingReconciliationAdjustments.AsReference[]
}

export class ShowSerializer extends BaseSerializer<FundingReconciliation> {
  perform() {
    const { adjustments } = this.record
    if (isUndefined(adjustments)) {
      throw new Error("Expected adjustments association to be preloaded.")
    }

    const adjustmentsSerialized =
      FundingReconciliationAdjustments.ReferenceSerializer.perform(adjustments)
    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fundingPeriodId",
        "status",
        "fundingReceivedTotalAmount",
        "eligibleExpensesTotalAmount",
        "payrollAdjustmentsTotalAmount",
        "finalBalanceAmount",
        "notes",
        "finalizedAt",
        "finalizedById",
        "createdAt",
        "updatedAt",
      ]),
      adjustments: adjustmentsSerialized,
    }
  }
}

export default ShowSerializer
