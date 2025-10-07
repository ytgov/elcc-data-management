import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"

export type FundingPeriodCreationAttributes = Partial<CreationAttributes<FundingPeriod>>

export class CreateService extends BaseService {
  constructor(private attributes: FundingPeriodCreationAttributes) {
    super()
  }

  async perform(): Promise<FundingPeriod> {
    const { fiscalYear, fromDate, toDate, title, ...optionalAttributes } = this.attributes

    if (isNil(fiscalYear)) {
      throw new Error("Fiscal year is required")
    }

    if (isNil(fromDate)) {
      throw new Error("From date is required")
    }

    if (isNil(toDate)) {
      throw new Error("To date is required")
    }

    if (isNil(title)) {
      throw new Error("Title is required")
    }

    const fundingPeriod = await FundingPeriod.create({
      ...optionalAttributes,
      fiscalYear,
      fromDate,
      toDate,
      title,
    })

    return fundingPeriod.reload()
  }
}

export default CreateService
