import { pick } from "lodash"

import { EmployeeWageTier } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type EmployeeWageTierAsShow = Pick<
  EmployeeWageTier,
  | "id"
  | "fiscalPeriodId"
  | "tierLevel"
  | "tierLabel"
  | "wageRatePerHour"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<EmployeeWageTier> {
  perform(): EmployeeWageTierAsShow {
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

export default ShowSerializer
