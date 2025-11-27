import { pick } from "lodash"

import { FundingReconciliationAdjustment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingReconciliationAdjustmentAsReference = Pick<
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

export class ReferenceSerializer extends BaseSerializer<FundingReconciliationAdjustment> {
  perform(): FundingReconciliationAdjustmentAsReference {
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

export default ReferenceSerializer
