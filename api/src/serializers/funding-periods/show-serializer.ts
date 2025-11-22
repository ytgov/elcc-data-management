import { pick } from "lodash"

import { FundingPeriod } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingPeriodShowView = Pick<
  FundingPeriod,
  "id" | "fiscalYear" | "fromDate" | "toDate" | "title" | "createdAt" | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<FundingPeriod> {
  perform(): FundingPeriodShowView {
    return pick(this.record, [
      "id",
      "fiscalYear",
      "fromDate",
      "toDate",
      "title",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default ShowSerializer
