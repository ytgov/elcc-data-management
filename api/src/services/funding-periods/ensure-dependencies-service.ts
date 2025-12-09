import { type CreationAttributes } from "@sequelize/core"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingPeriod,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
} from "@/models"

import BaseService from "@/services/base-service"

// NOTE: this is a shim service until all dependencies are being created by funding-period creation.
export class EnsureDependenciesService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform() {
    await this.ensureBuildingExpenses()
    await this.ensureFundingSubmissionLineJsons()
  }

  private async ensureBuildingExpenses() {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriodFiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      attributes: ["id"],
      where: {
        fiscalYear: shortFiscalYear,
      },
    })
    if (fiscalPeriods.length === 0) {
      throw new Error(`No fiscal periods found for fiscal year: ${shortFiscalYear}`)
    }

    const fiscalPeriodIds = fiscalPeriods.map(({ id }) => id)
    const existingBuildingExpenseCount = await BuildingExpense.count({
      where: {
        centreId: this.centre.id,
        fiscalPeriodId: fiscalPeriodIds,
      },
    })
    if (existingBuildingExpenseCount > 0) return

    const { region, buildingUsagePercent } = this.centre
    const buildingExpenseCategories = await BuildingExpenseCategory.findAll({
      include: [
        {
          association: "fundingRegion",
          where: {
            region,
          },
        },
      ],
    })
    if (buildingExpenseCategories.length === 0) {
      throw new Error(`No building expense categories found for Centre region="${region}"`)
    }

    const buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = []
    for (const fiscalPeriodId of fiscalPeriodIds) {
      for (const category of buildingExpenseCategories) {
        buildingExpensesAttributes.push({
          centreId: this.centre.id,
          fiscalPeriodId: fiscalPeriodId,
          buildingExpenseCategoryId: category.id,
          subsidyRate: category.subsidyRate,
          buildingUsagePercent,
          estimatedCost: "0",
          actualCost: "0",
          totalCost: "0",
        })
      }
    }

    await BuildingExpense.bulkCreate(buildingExpensesAttributes)
  }

  private async ensureFundingSubmissionLineJsons() {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.count({
      where: {
        centreId: this.centre.id,
        fiscalYear: fiscalYearLegacy,
      },
    })
    if (fundingSubmissionLineJsonCount > 0) return

    const fundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: fiscalYearLegacy,
      },
    })
    if (fundingSubmissionLines.length === 0) {
      throw new Error(
        `No funding submission lines to template from found for the given fiscal year: ${fiscalYearLegacy}`
      )
    }

    const defaultLineValues = fundingSubmissionLines.map((fundingSubmissionLine) => ({
      submissionLineId: fundingSubmissionLine.id,
      sectionName: fundingSubmissionLine.sectionName,
      lineName: fundingSubmissionLine.lineName,
      monthlyAmount: fundingSubmissionLine.monthlyAmount,
      estimatedChildOccupancyRate: "0",
      actualChildOccupancyRate: "0",
      estimatedComputedTotal: "0",
      actualComputedTotal: "0",
    }))

    const fundingSubmissionLineJsonAttributes: CreationAttributes<FundingSubmissionLineJson>[] = []

    this.fundingPeriod.forEachMonth((dateStart, dateEnd, monthName) => {
      const dateName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(monthName)
      fundingSubmissionLineJsonAttributes.push({
        centreId: this.centre.id,
        fiscalYear: fiscalYearLegacy,
        dateName,
        dateStart,
        dateEnd,
        values: JSON.stringify(defaultLineValues),
      })
    })

    await FundingSubmissionLineJson.bulkCreate(fundingSubmissionLineJsonAttributes)
  }
}

export default EnsureDependenciesService
