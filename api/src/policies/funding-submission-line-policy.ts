import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { FundingSubmissionLine, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class FundingSubmissionLinePolicy extends PolicyFactory(FundingSubmissionLine) {
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
    return ["sectionName", "lineName", "fromAge", "toAge", "monthlyAmount"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["fiscalYear", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<FundingSubmissionLine>> {
    return {}
  }
}

export default FundingSubmissionLinePolicy
