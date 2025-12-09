import { type CreationAttributes } from "@sequelize/core"

import { Centre, FundingPeriod, FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"

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
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.count({
      where: {
        centreId: this.centre.id,
        fiscalYear: fiscalYearLegacy,
      },
    })
    if (fundingSubmissionLineJsonCount > 0) {
      throw new Error(
        `Funding submission line JSON records already exist for centre id ${this.centre.id} and fiscal year ${fiscalYearLegacy}`
      )
    }

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

    return FundingSubmissionLineJson.findAll({
      where: {
        centreId: this.centre.id,
        fiscalYear: fiscalYearLegacy,
      },
      order: ["dateStart"],
    })
  }
}

export default EnsureDependenciesService
