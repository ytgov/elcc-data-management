import { pick } from "lodash"

import { FundingSubmissionLine } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FundingSubmissionLineShowView = Pick<
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

export class ShowSerializer extends BaseSerializer<FundingSubmissionLine> {
  perform(): FundingSubmissionLineShowView {
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

export default ShowSerializer
