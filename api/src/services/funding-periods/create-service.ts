import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import db, {
  Centre,
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
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

      const {
        id: fundingPeriodId,
        fromDate: fundingPeriodFromDate,
        toDate: fundingPeriodToDate,
        fiscalYear: fundingPeriodFiscalYear,
      } = fundingPeriod

      await this.createFiscalPeriods(
        fundingPeriodId,
        fundingPeriodFiscalYear,
        fundingPeriodFromDate,
        fundingPeriodToDate
      )
      await this.createEmployeeWageTiers(fundingPeriodFiscalYear)
      await this.createEmployeeBenefits(fundingPeriodFiscalYear)
      await this.createFundingSubmissionLines(fundingPeriod)
      await this.createFundingReconciliations(fundingPeriod)
      await this.createFundingReconciliationAdjustments(fundingPeriod)

      return fundingPeriod.reload()
    })
  }

  private async createFiscalPeriods(
    fundingPeriodId: number,
    fiscalYearLong: string,
    fromDate: Date,
    toDate: Date
  ) {
    const fiscalYearShort = FiscalPeriod.toShortFiscalYearFormat(fiscalYearLong)

    let currentDate = DateTime.fromJSDate(fromDate)
    const toDateDateTime = DateTime.fromJSDate(toDate)
    const fiscalPeriodsAttributes: CreationAttributes<FiscalPeriod>[] = []

    while (currentDate <= toDateDateTime) {
      const dateStart = currentDate.startOf("month")
      const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
      const dateName = dateStart.toFormat("MMMM").toLowerCase()

      fiscalPeriodsAttributes.push({
        fundingPeriodId,
        fiscalYear: fiscalYearShort,
        month: dateName as FiscalPeriodMonths,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
      })

      currentDate = currentDate.plus({ months: 1 })
    }

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
          grossPayrollMonthlyActual: "0",
          grossPayrollMonthlyEstimated: "0",
          costCapPercentage: "0",
          employeeCostActual: "0",
          employeeCostEstimated: "0",
          employerCostActual: "0",
          employerCostEstimated: "0",
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

  private async createFundingReconciliations(fundingPeriod: FundingPeriod) {
    let fundingReconciliationsAttributes: CreationAttributes<FundingReconciliation>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      fundingReconciliationsAttributes.push({
        centreId: centre.id,
        fundingPeriodId: fundingPeriod.id,
        status: FundingReconciliationStatuses.DRAFT,
        fundingReceivedTotalAmount: "0",
        eligibleExpensesTotalAmount: "0",
        payrollAdjustmentsTotalAmount: "0",
        finalBalanceAmount: "0",
      })

      if (fundingReconciliationsAttributes.length >= BATCH_SIZE) {
        await FundingReconciliation.bulkCreate(fundingReconciliationsAttributes)
        fundingReconciliationsAttributes = []
      }
    })

    if (fundingReconciliationsAttributes.length > 0) {
      await FundingReconciliation.bulkCreate(fundingReconciliationsAttributes)
    }
  }

  private async createFundingReconciliationAdjustments(fundingPeriod: FundingPeriod) {
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriod.fiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    let adjustmentsAttributes: CreationAttributes<FundingReconciliationAdjustment>[] = []
    const BATCH_SIZE = 1000

    await FundingReconciliation.findEach(
      { where: { fundingPeriodId: fundingPeriod.id } },
      async (fundingReconciliation) => {
        for (const fiscalPeriod of fiscalPeriods) {
          adjustmentsAttributes.push({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          })

          if (adjustmentsAttributes.length >= BATCH_SIZE) {
            await FundingReconciliationAdjustment.bulkCreate(adjustmentsAttributes)
            adjustmentsAttributes = []
          }
        }
      }
    )

    if (adjustmentsAttributes.length > 0) {
      await FundingReconciliationAdjustment.bulkCreate(adjustmentsAttributes)
    }
  }
}

export default CreateService
