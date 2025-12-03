import { pick } from "lodash"

import { FiscalPeriod } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type FiscalPeriodAsReference = Pick<
  FiscalPeriod,
  "id" | "fiscalYear" | "month" | "dateStart" | "dateEnd"
>

export class ReferenceSerializer extends BaseSerializer<FiscalPeriod> {
  perform(): FiscalPeriodAsReference {
    return {
      ...pick(this.record, ["id", "fiscalYear", "month", "dateStart", "dateEnd"]),
    }
  }
}

export default ReferenceSerializer
