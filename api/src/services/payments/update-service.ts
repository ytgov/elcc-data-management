import { Attributes } from "@sequelize/core"

import { Payment } from "@/models"
import BaseService from "@/services/base-service"

export type PaymentUpdateAttributes = Partial<Attributes<Payment>>

export class UpdateService extends BaseService {
  constructor(
    private payment: Payment,
    private attributes: PaymentUpdateAttributes
  ) {
    super()
  }

  async perform(): Promise<Payment> {
    await this.payment.update(this.attributes)
    return this.payment.reload({
      include: ["fiscalPeriod"],
    })
  }
}

export default UpdateService
