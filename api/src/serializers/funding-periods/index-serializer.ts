import { pick } from "lodash"

import { FundingPeriod } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingPeriodIndexView = Pick<
  FundingPeriod,
  | "id"
  | "fiscalYear"
  | "fromDate"
  | "toDate"
  | "title"
  | "isFiscalYear"
  | "isSchoolMonth"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<FundingPeriod> {
  perform(): FundingPeriodIndexView {
    return pick(this.record, [
      "id",
      "fiscalYear",
      "fromDate",
      "toDate",
      "title",
      "isFiscalYear",
      "isSchoolMonth",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default IndexSerializer
