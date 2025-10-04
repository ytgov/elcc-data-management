import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Payment } from "@/models"
import BaseService from "@/services/base-service"

export type PaymentCreationAttributes = Partial<CreationAttributes<Payment>>

export class CreateService extends BaseService {
  constructor(private attributes: PaymentCreationAttributes) {
    super()
  }

  async perform(): Promise<Payment> {
    const {
      centreId,
      fiscalPeriodId,
      fiscalYear,
      paidOn,
      amountInCents,
      name,
      ...optionalAttributes
    } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    if (isNil(fiscalYear)) {
      throw new Error("Fiscal year is required")
    }

    if (isNil(paidOn)) {
      throw new Error("Paid on date is required")
    }

    if (isNil(amountInCents)) {
      throw new Error("Amount in cents is required")
    }

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    const payment = await Payment.create({
      ...optionalAttributes,
      centreId,
      fiscalPeriodId,
      fiscalYear,
      paidOn,
      amountInCents,
      name,
    })
    return payment.reload()
  }
}

export default CreateService
