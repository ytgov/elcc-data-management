import { Attributes } from "@sequelize/core"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserUpdateAttributes = Partial<Attributes<User>>

export class UpdateService extends BaseService {
  constructor(
    private user: User,
    private attributes: UserUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<User> {
    await this.user.update(this.attributes)
    return this.user.reload({
      include: ["roles"],
    })
  }
}

export default UpdateService
