import { pick } from "lodash"

import { EmployeeWageTier } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type EmployeeWageTierAsReference = Pick<
  EmployeeWageTier,
  "id" | "fiscalPeriodId" | "tierLevel" | "tierLabel" | "wageRatePerHour"
>

export class ReferenceSerializer extends BaseSerializer<EmployeeWageTier> {
  perform(): EmployeeWageTierAsReference {
    return pick(this.record, [
      "id",
      "fiscalPeriodId",
      "tierLevel",
      "tierLabel",
      "wageRatePerHour",
    ])
  }
}

export default ReferenceSerializer
