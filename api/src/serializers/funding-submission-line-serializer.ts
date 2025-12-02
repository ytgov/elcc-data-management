import { pick } from "lodash"

import { FundingSubmissionLine } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class FundingSubmissionLineSerializer extends BaseSerializer<FundingSubmissionLine> {
  static asTable(fundingSubmissionLines: FundingSubmissionLine[]) {
    return fundingSubmissionLines.map((fundingSubmissionLine) => {
      return new this(fundingSubmissionLine).asTable()
    })
  }

  private asTable() {
    return {
      ...pick(this.record, [
        "id",
        "fiscalYear",
        "sectionName",
        "lineName",
        "fromAge",
        "toAge",
        "monthlyAmount",
      ]),
      ageRange: `${this.record.fromAge} ${this.record.toAge}`,
    }
  }
}

export default FundingSubmissionLineSerializer
