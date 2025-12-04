import { FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private fundingRegion: FundingRegion,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.fundingRegion.destroy()
  }
}

export default DestroyService
