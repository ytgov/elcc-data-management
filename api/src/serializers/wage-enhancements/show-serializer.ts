import { isUndefined, pick } from "lodash"

import { WageEnhancement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { EmployeeWageTiers } from "@/serializers"

export type WageEnhancementAsShow = Pick<
  WageEnhancement,
  | "id"
  | "centreId"
  | "employeeWageTierId"
  | "employeeName"
  | "hoursEstimated"
  | "hoursActual"
  | "createdAt"
  | "updatedAt"
> & {
  employeeWageTier: EmployeeWageTiers.AsReference
}

export class ShowSerializer extends BaseSerializer<WageEnhancement> {
  perform(): WageEnhancementAsShow {
    const { employeeWageTier } = this.record
    if (isUndefined(employeeWageTier)) {
      throw new Error("Expected employeeWageTier association to be preloaded.")
    }

    const employeeWageTierSerialized =
      EmployeeWageTiers.ReferenceSerializer.perform(employeeWageTier)

    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "employeeWageTierId",
        "employeeName",
        "hoursEstimated",
        "hoursActual",
        "createdAt",
        "updatedAt",
      ]),
      employeeWageTier: employeeWageTierSerialized,
    }
  }
}

export default ShowSerializer
