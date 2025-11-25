import { pick } from "lodash"

import { FundingReconciliationAdjustment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingReconciliationAdjustmentAsShow = Pick<
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

export class ShowSerializer extends BaseSerializer<FundingReconciliationAdjustment> {
  perform(): FundingReconciliationAdjustmentAsShow {
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

export default ShowSerializer
