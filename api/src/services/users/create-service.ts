import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserCreationAttributes = Partial<CreationAttributes<User>>

export class CreateService extends BaseService {
  constructor(private attributes: UserCreationAttributes) {
    super()
  }

  async perform(): Promise<User> {
    const { email, sub, firstName, lastName, status, ...optionalAttributes } = this.attributes

    if (isNil(email)) {
      throw new Error("Email is required")
    }

    if (isNil(sub)) {
      throw new Error("Auth0 Subject is required")
    }

    if (isNil(firstName)) {
      throw new Error("First name is required")
    }

    if (isNil(lastName)) {
      throw new Error("Last name is required")
    }

    const statusOrFallback = status || User.Status.ACTIVE

    const user = await User.create({
      ...optionalAttributes,
      email,
      sub,
      firstName,
      lastName,
      status: statusOrFallback,
    })
    return user.reload()
  }
}

export default CreateService
