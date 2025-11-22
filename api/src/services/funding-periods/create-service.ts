import { CreationAttributes } from "@sequelize/core"
import { isNil, times } from "lodash"
import { DateTime } from "luxon"

import db, { Centre, EmployeeBenefit, EmployeeWageTier, FiscalPeriod, FundingPeriod } from "@/models"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"
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

    return db.transaction(async () => {
      const fundingPeriod = await FundingPeriod.create({
        ...optionalAttributes,
        fiscalYear,
        fromDate,
        toDate,
        title,
      })

      const { fromDate: fundingPeriodFromDate, fiscalYear: fundingPeriodFiscalYear } = fundingPeriod

      await this.createFiscalPeriods(fundingPeriodFromDate, fundingPeriodFiscalYear)
      await this.createEmployeeWageTiers(fundingPeriodFiscalYear)
      await this.createEmployeeBenefits(fundingPeriodFiscalYear)
      await this.createFundingSubmissionLines(fundingPeriod)

      return fundingPeriod.reload()
    })
  }

  private async createFiscalPeriods(fromDate: Date, fiscalYear: string) {
    const fiscalYearStart = DateTime.fromJSDate(fromDate)
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fiscalYear)

    const fiscalPeriodsAttributes = times(12, (i) => {
      const date = fiscalYearStart.plus({ months: i }).startOf("month")
      const dateStart = date.startOf("month")
      const dateEnd = date.endOf("month").set({ millisecond: 0 })
      const month = FiscalPeriod.asFiscalPeriodMonth(dateStart)

      return {
        fiscalYear: shortFiscalYear,
        month,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
      }
    })

    await FiscalPeriod.bulkCreate(fiscalPeriodsAttributes)
  }

  private async createEmployeeWageTiers(fiscalYear: string) {
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    const employeeWageTiersAttributes = fiscalPeriods.flatMap((fiscalPeriod) =>
      EMPLOYEE_WAGE_TIER_DEFAULTS.map((employeeWageTier) => ({
        fiscalPeriodId: fiscalPeriod.id,
        ...employeeWageTier,
      }))
    )

    await EmployeeWageTier.bulkCreate(employeeWageTiersAttributes)
  }

  private async createEmployeeBenefits(fiscalYear: string) {
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    let employeeBenefitsAttributes: CreationAttributes<EmployeeBenefit>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      for (const fiscalPeriod of fiscalPeriods) {
        employeeBenefitsAttributes.push({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 0,
          grossPayrollMonthlyEstimated: 0,
          costCapPercentage: 0,
          employeeCostActual: 0,
          employeeCostEstimated: 0,
          employerCostActual: 0,
          employerCostEstimated: 0,
        })

        if (employeeBenefitsAttributes.length >= BATCH_SIZE) {
          await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
          employeeBenefitsAttributes = []
        }
      }
    })

    if (employeeBenefitsAttributes.length > 0) {
      await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
    }
  }

  private async createFundingSubmissionLines(_fundingPeriod: FundingPeriod) {
    // TODO: Implement funding submission lines creation
    // This would create the default funding submission lines for the created funding period
    // See api/src/db/seeds/development/2023.12.12T00.25.25.fill-funding-submission-lines-table.ts
  }
}

export default CreateService
