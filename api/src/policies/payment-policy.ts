import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { Payment, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class PaymentPolicy extends PolicyFactory(Payment) {
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
    return ["paidOn", "amount", "name"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["centreId", "fiscalPeriodId", "fiscalYear", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Payment>> {
    return {}
  }
}

export default PaymentPolicy
