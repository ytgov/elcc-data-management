import { pick } from "lodash"

import { FundingReconciliation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingReconciliationAsIndex = Pick<
  FundingReconciliation,
  | "id"
  | "centreId"
  | "fundingPeriodId"
  | "status"
  | "fundingReceivedTotalAmount"
  | "eligibleExpensesTotalAmount"
  | "payrollAdjustmentsTotalAmount"
  | "finalBalanceAmount"
  | "finalizedAt"
  | "finalizedById"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<FundingReconciliation> {
  perform(): FundingReconciliationAsIndex {
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
        "finalizedAt",
        "finalizedById",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default IndexSerializer
