import { Centre, EmployeeBenefit } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForCentreService from "@/services/employee-benefits/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const employeeBenefitCount = await EmployeeBenefit.count({
      where: {
        centreId: this.centre.id,
      },
    })
    if (employeeBenefitCount > 0) return

    await BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
