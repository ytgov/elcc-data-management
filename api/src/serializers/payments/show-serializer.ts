import { pick } from "lodash"

import { Payment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type PaymentAsShow = Pick<
  Payment,
  | "id"
  | "centreId"
  | "fiscalPeriodId"
  | "fiscalYear"
  | "paidOn"
  | "amountInCents"
  | "name"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<Payment> {
  perform(): PaymentAsShow {
    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fiscalPeriodId",
        "fiscalYear",
        "paidOn",
        "amountInCents",
        "name",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer
