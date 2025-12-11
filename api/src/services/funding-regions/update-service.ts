import { FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export class UpdateService extends BaseService {
  constructor(
    private fundingRegion: FundingRegion,
    private attributes: Partial<FundingRegion>,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FundingRegion> {
    return this.fundingRegion.update(this.attributes)
  }
}

export default UpdateService
