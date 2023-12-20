import { pick } from "lodash"

import { formatDollar } from "@/utils/formatter"

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
      // TODO: move formating of it to the front-end
      monthlyAmountDisplay: formatDollar(this.record.monthlyAmount),
    }
  }
}

export default FundingSubmissionLineSerializer
