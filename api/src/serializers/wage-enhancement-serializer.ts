import { pick } from "lodash"
import { WageEnhancement } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class WageEnhancementSerializer extends BaseSerializer<WageEnhancement> {
  static asTable(wageEnhancements: WageEnhancement[]) {
    return wageEnhancements.map((wageEnhancement) => {
      return {
        ...pick(wageEnhancement, [
          "id",
          "centreId",
          "employeeWageTierId",
          "employeeName",
          "hoursEstimated",
          "hoursActual",
          "createdAt",
          "updatedAt",
        ]),
      }
    })
  }

  static asDetailed(wageEnhancement: WageEnhancement) {
    return {
      ...pick(wageEnhancement, [
        "id",
        "centreId",
        "employeeWageTierId",
        "employeeName",
        "hoursEstimated",
        "hoursActual",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default WageEnhancementSerializer
