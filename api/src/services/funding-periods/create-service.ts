import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import { FundingPeriods } from "@/services"

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

    return db.transaction(async () => {
      const fundingPeriod = await FundingPeriod.create({
        ...optionalAttributes,
        fiscalYear,
        fromDate,
        toDate,
        title,
      })

      await this.prefillChildEntities(fundingPeriod)

      return fundingPeriod
    })
  }

  private async prefillChildEntities(fundingPeriod: FundingPeriod) {
    await FundingPeriods.FiscalPeriods.BulkCreateService.perform(fundingPeriod)
    await FundingPeriods.EmployeeWageTiers.BulkCreateService.perform(fundingPeriod)
    await FundingPeriods.FundingSubmissionLines.BulkCreateService.perform(fundingPeriod)
  }
}

export default CreateService
