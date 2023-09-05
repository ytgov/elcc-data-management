import { FundingSubmissionLine } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

import { FormatDollar } from "@/utils/formatter"

export class FundingSubmissionLineSerializer extends BaseSerializer<FundingSubmissionLine> {
  constructor(modelOrModels: FundingSubmissionLine | FundingSubmissionLine[]) {
    super(modelOrModels)
  }

  protected registerDefaultView() {
    const view = this.addView("default")
    view.addfields(
      "id",
      "fiscalYear",
      "sectionName",
      "lineName",
      "fromAge",
      "toAge",
      "monthlyAmount"
    )

    view.addField(
      "ageRange",
      (model: FundingSubmissionLine): string => `${model.fromAge} ${model.toAge}`
    )
    // TODO: switch money to being stored as cents and move all formating of it to the front-end
    view.addField("monthlyAmountDisplay", (model: FundingSubmissionLine): string =>
      FormatDollar(model.monthlyAmount)
    )
    return view
  }
}

export default FundingSubmissionLineSerializer
