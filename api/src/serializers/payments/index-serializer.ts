import { pick } from "lodash"

import { Payment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type PaymentIndexView = Pick<
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

export class IndexSerializer extends BaseSerializer<Payment> {
  perform(): PaymentIndexView {
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

export default IndexSerializer
