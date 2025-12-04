import { Centre, User } from "@/models"
import BaseService from "@/services/base-service"

export class UpdateService extends BaseService {
  constructor(
    private centre: Centre,
    private attributes: Partial<Centre>,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<Centre> {
    return this.centre.update(this.attributes)
  }
}

export default UpdateService
