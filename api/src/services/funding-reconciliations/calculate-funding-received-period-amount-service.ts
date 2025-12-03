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
    const paymentsTotalAmountOrNull = await Payment.sum("amount", {
      where: {
        centreId: this.centreId,
        fiscalPeriodId: this.fiscalPeriodId,
      },
    })
    const paymentsTotalAmount = paymentsTotalAmountOrNull ?? 0
    const paymentsTotalAmountInDollars = Big(paymentsTotalAmount)

    return paymentsTotalAmountInDollars.toFixed(4)
  }
}

export default CalculateFundingReceivedPeriodAmountService
