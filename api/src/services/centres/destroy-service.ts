import { Centre, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private centre: Centre,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.centre.destroy()
  }
}

export default DestroyService
