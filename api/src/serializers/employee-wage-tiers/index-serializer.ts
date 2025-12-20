import { pick } from "lodash"

import { EmployeeWageTier } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type EmployeeWageTierAsIndex = Pick<
  EmployeeWageTier,
  "id" | "fiscalPeriodId" | "tierLevel" | "tierLabel" | "wageRatePerHour" | "createdAt" | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<EmployeeWageTier> {
  perform(): EmployeeWageTierAsIndex {
    return pick(this.record, [
      "id",
      "fiscalPeriodId",
      "tierLevel",
      "tierLabel",
      "wageRatePerHour",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default IndexSerializer
