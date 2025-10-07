import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingSubmissionLine } from "@/models"
import BaseService from "@/services/base-service"

export type FundingSubmissionLineCreationAttributes = Partial<
  CreationAttributes<FundingSubmissionLine>
>

export class CreateService extends BaseService {
  constructor(private attributes: FundingSubmissionLineCreationAttributes) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine> {
    const { fiscalYear, sectionName, lineName, monthlyAmount, ...optionalAttributes } =
      this.attributes

    if (isNil(fiscalYear)) {
      throw new Error("Fiscal year is required")
    }

    if (isNil(sectionName)) {
      throw new Error("Section name is required")
    }

    if (isNil(lineName)) {
      throw new Error("Line name is required")
    }

    if (isNil(monthlyAmount)) {
      throw new Error("Monthly amount is required")
    }

    const fundingSubmissionLine = await FundingSubmissionLine.create({
      ...optionalAttributes,
      fiscalYear,
      sectionName,
      lineName,
      monthlyAmount,
    })

    return fundingSubmissionLine
  }
}

export default CreateService
