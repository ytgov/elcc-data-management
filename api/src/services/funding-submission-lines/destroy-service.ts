import { FundingSubmissionLine } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(private fundingSubmissionLine: FundingSubmissionLine) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist()

    await this.fundingSubmissionLine.destroy()
  }

  private async assertNoDependentEntitiesExist() {
    // Currently, funding submission lines have no dependent entities.
    // This method is kept for consistency and future extension.
  }
}

export default DestroyService
