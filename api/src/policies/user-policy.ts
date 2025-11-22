import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class UserPolicy extends PolicyFactory(User) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.id === this.record.id) return true

    return false
  }

  destroy(): boolean {
    return this.user.isSystemAdmin
  }

  permittedAttributes(): Path[] {
    const attributes = ["firstName", "lastName"]
    if (this.user.isSystemAdmin) {
      attributes.push("status", "roles")
    }

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return ["email", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<User>> {
    return {}
  }
}

export default UserPolicy
