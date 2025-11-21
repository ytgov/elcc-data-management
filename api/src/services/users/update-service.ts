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
    return this.user.update(this.attributes)
  }
}

export default UpdateService
