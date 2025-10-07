import { pick } from "lodash"

import { FundingSubmissionLine } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingSubmissionLineIndexView = Pick<
  FundingSubmissionLine,
  | "id"
  | "fiscalYear"
  | "sectionName"
  | "lineName"
  | "fromAge"
  | "toAge"
  | "monthlyAmount"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<FundingSubmissionLine> {
  perform(): FundingSubmissionLineIndexView {
    return {
      ...pick(this.record, [
        "id",
        "fiscalYear",
        "sectionName",
        "lineName",
        "fromAge",
        "toAge",
        "monthlyAmount",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default IndexSerializer
