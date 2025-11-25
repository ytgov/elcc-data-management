import { pick } from "lodash"

import { FundingReconciliationAdjustment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingReconciliationAdjustmentAsIndex = Pick<
  FundingReconciliationAdjustment,
  | "id"
  | "fundingReconciliationId"
  | "fiscalPeriodId"
  | "fundingReceivedPeriodAmount"
  | "eligibleExpensesPeriodAmount"
  | "payrollAdjustmentsPeriodAmount"
  | "cumulativeBalanceAmount"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<FundingReconciliationAdjustment> {
  perform(): FundingReconciliationAdjustmentAsIndex {
    return {
      ...pick(this.record, [
        "id",
        "fundingReconciliationId",
        "fiscalPeriodId",
        "fundingReceivedPeriodAmount",
        "eligibleExpensesPeriodAmount",
        "payrollAdjustmentsPeriodAmount",
        "cumulativeBalanceAmount",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default IndexSerializer
