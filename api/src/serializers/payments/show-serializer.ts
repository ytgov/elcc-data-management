import { isUndefined, pick } from "lodash"

import { Payment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { FiscalPeriods } from "@/serializers"

export type PaymentAsShow = Pick<
  Payment,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "fiscalYear"
  | "paidOn"
  | "amount"
  | "name"
  | "createdAt"
  | "updatedAt"
> & {
  fiscalPeriod: FiscalPeriods.AsReference
}

export class ShowSerializer extends BaseSerializer<Payment> {
  perform(): PaymentAsShow {
    const { fiscalPeriod } = this.record
    if (isUndefined(fiscalPeriod)) {
      throw new Error("Expected fiscalPeriod association to be preloaded.")
    }

    const fiscalPeriodSerialized = FiscalPeriods.ReferenceSerializer.perform(fiscalPeriod)

    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fiscalPeriodId",
        "fiscalYear",
        "paidOn",
        "amount",
        "name",
        "createdAt",
        "updatedAt",
      ]),
      fiscalPeriod: fiscalPeriodSerialized,
    }
  }
}

export default ShowSerializer
