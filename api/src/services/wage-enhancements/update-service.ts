import { WageEnhancement, User } from "@/models"
import BaseService from "@/services/base-service"

export class UpdateService extends BaseService {
  constructor(
    private wageEnhancement: WageEnhancement,
    private attributes: Partial<WageEnhancement>,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<WageEnhancement> {
    await this.wageEnhancement.update(this.attributes)
    return this.wageEnhancement.reload({
      include: ["employeeWageTier"],
    })
  }
}

export default UpdateService
