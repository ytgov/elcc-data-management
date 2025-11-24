import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"
import { UserPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/users"
import { IndexSerializer, ShowSerializer } from "@/serializers/users"
import BaseController from "@/controllers/base-controller"

export class UsersController extends BaseController<User> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedUsers = UserPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedUsers.count({ where })
      const users = await scopedUsers.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedUsers = IndexSerializer.perform(users)
      return this.response.json({
        users: serializedUsers,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching users: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching users: ${error}`,
      })
    }
  }

  async show() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this user",
        })
      }

      const serializedUser = ShowSerializer.perform(user)
      return this.response.json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching user: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching user: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create users",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const user = await CreateService.perform(permittedAttributes)
      const serializedUser = ShowSerializer.perform(user)
      return this.response.status(201).json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating user: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating user: ${error}`,
      })
    }
  }

  async update() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this user",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedUser = await UpdateService.perform(user, permittedAttributes)
      const serializedUser = ShowSerializer.perform(updatedUser)
      return this.response.json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating user: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating user: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this user",
        })
      }

      await user.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting user: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting user: ${error}`,
      })
    }
  }

  private loadUser() {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(user: User = User.build()) {
    return new UserPolicy(this.currentUser, user)
  }
}

export default UsersController
