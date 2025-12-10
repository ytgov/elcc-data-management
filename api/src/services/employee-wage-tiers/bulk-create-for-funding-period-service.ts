import { EmployeeWageTier, FiscalPeriod, FundingPeriod } from "@/models"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"
import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod

    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriodFiscalYear)

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
}

export default BulkCreateForFundingPeriodService
