import logger from "@/utils/logger"

import { User } from "@/models"
import { UserPolicy } from "@/policies"
import { ShowSerializer } from "@/serializers/current-user"
import BaseController from "@/controllers/base-controller"

export class CurrentUserController extends BaseController {
  async show() {
    try {
      const user = this.currentUser
      const policy = this.buildPolicy(user)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view the current user",
        })
      }

      const serializedUser = ShowSerializer.perform(user)
      return this.response.json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching current user: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching current user: ${error}`,
      })
    }
  }

  private buildPolicy(user: User) {
    return new UserPolicy(this.currentUser, user)
  }
}

export default CurrentUserController
