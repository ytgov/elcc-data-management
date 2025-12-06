import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import {
  BuildingExpenses,
  EmployeeBenefits,
  EmployeeWageTiers,
  FiscalPeriods,
  FundingReconciliationAdjustments,
  FundingReconciliations,
} from "@/services"


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

      await this.createFiscalPeriods(fundingPeriod)
      await this.createEmployeeWageTiers(fundingPeriod)
      await this.createEmployeeBenefits(fundingPeriod)
      await this.createBuildingExpenses(fundingPeriod)
      await this.createFundingSubmissionLines(fundingPeriod)
      await this.createFundingReconciliations(fundingPeriod)
      await this.createFundingReconciliationAdjustments(fundingPeriod)

      return fundingPeriod.reload()
    })
  }

  private async createFiscalPeriods(fundingPeriod: FundingPeriod) {
    await FiscalPeriods.BulkCreateForService.perform(fundingPeriod)
  }

  private async createEmployeeWageTiers(fundingPeriod: FundingPeriod) {
    await EmployeeWageTiers.BulkCreateForService.perform(fundingPeriod)
  }

  private async createEmployeeBenefits(fundingPeriod: FundingPeriod) {
    await EmployeeBenefits.BulkCreateForService.perform(fundingPeriod)
  }

  private async createBuildingExpenses(fundingPeriod: FundingPeriod) {
    await BuildingExpenses.BulkCreateForService.perform(fundingPeriod)
  }

  private async createFundingSubmissionLines(_fundingPeriod: FundingPeriod) {
    // TODO: Implement funding submission lines creation
    // This would create the default funding submission lines for the created funding period
    // See api/src/db/seeds/development/2023.12.12T00.25.25.fill-funding-submission-lines-table.ts
    // Maybe ? FundingSubmissionLineJsonServices.bulkCreate(centerId, fiscalYear)
  }

  private async createFundingReconciliations(fundingPeriod: FundingPeriod) {
    await FundingReconciliations.BulkCreateForService.perform(fundingPeriod)
  }

  private async createFundingReconciliationAdjustments(fundingPeriod: FundingPeriod) {
    await FundingReconciliationAdjustments.BulkCreateForService.perform(fundingPeriod)
  }
}

export default CreateService
