import { EmployeeWageTier, FiscalPeriod, FundingPeriod } from "@/models"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"
import BaseService from "@/services/base-service"
import { FundingPeriods } from "@/services"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<EmployeeWageTier[]> {
    const fiscalPeriods = await this.ensureFiscalPeriodsForFundingPeriod(this.fundingPeriod)

    const employeeWageTiersAttributes = fiscalPeriods.flatMap((fiscalPeriod) =>
      EMPLOYEE_WAGE_TIER_DEFAULTS.map((employeeWageTier) => ({
        fiscalPeriodId: fiscalPeriod.id,
        ...employeeWageTier,
      }))
    )

    return EmployeeWageTier.bulkCreate(employeeWageTiersAttributes)
  }

  private async ensureFiscalPeriodsForFundingPeriod(
    fundingPeriod: FundingPeriod
  ): Promise<FiscalPeriod[]> {
    return FundingPeriods.FiscalPeriods.BulkEnsureService.perform(fundingPeriod)
  }
}

export default BulkCreateForFundingPeriodService
