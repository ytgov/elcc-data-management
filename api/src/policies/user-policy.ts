import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class UserPolicy extends PolicyFactory(User) {
  show(): boolean {
    return true
  }

  create(): boolean {
    return true
  }

  update(): boolean {
    return true
  }

  destroy(): boolean {
    return true
  }

  permittedAttributes(): Path[] {
    const attributes = [
      "firstName",
      "lastName",
      "status",
      "isAdmin",
      {
        rolesAttributes: ["role"],
      },
    ]

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return ["email", "sub", "ynetId", "directoryId", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<User>> {
    return {}
  }
}

export default UserPolicy
