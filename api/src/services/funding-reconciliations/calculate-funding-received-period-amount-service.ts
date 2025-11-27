import Big from "big.js"

import { Payment } from "@/models"
import BaseService from "@/services/base-service"

export class CalculateFundingReceivedPeriodAmountService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform(): Promise<string> {
    const paymentsTotalAmountInCentsOrNull = await Payment.sum("amountInCents", {
      where: {
        centreId: this.centreId,
        fiscalPeriodId: this.fiscalPeriodId,
      },
    })
    const paymentsTotalAmountInCents = paymentsTotalAmountInCentsOrNull ?? 0
    const paymentsTotalAmountInDollars = Big(paymentsTotalAmountInCents).div(100)

    return paymentsTotalAmountInDollars.toFixed(4)
  }
}

export default CalculateFundingReceivedPeriodAmountService
