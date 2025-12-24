import { isEmpty } from "lodash"

import { Centre, EmployeeBenefit, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/centres/funding-periods/employee-benefits/bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<EmployeeBenefit[]> {
    const employeeBenefits = await EmployeeBenefit.withScope({
      method: ["byFundingPeriod", this.fundingPeriod.id],
    }).findAll({
      where: {
        centreId: this.centre.id,
      },
    })
    if (!isEmpty(employeeBenefits)) return employeeBenefits

    return BulkCreateService.perform(this.centre, this.fundingPeriod)
  }
}

export default BulkEnsureService
