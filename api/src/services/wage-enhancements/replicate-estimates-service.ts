import BaseService from "@/services/base-service"

export class ReplicateEstimatesService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default ReplicateEstimatesService
