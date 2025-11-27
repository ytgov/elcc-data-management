import Big from "big.js"

import sumByDecimal from "@/utils/sum-by-decimal"

import { FundingReconciliation, FundingReconciliationAdjustment } from "@/models"

import BaseService from "@/services/base-service"
import {
  CalculateEligibleExpensesPeriodAmountService,
  CalculateFundingReceivedPeriodAmountService,
  CalculatePayrollAdjustmentsPeriodAmountService,
} from "@/services/funding-reconciliations"

export class RefreshService extends BaseService {
  constructor(private fundingReconciliation: FundingReconciliation) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    // TODO: investigate adding stale check that would return "unchanged" status code.

    const { centreId } = this.fundingReconciliation

    const updatedFundingReconciliationAdjustment =
      await this.updateFundingReconciliationAdjustments(centreId, this.fundingReconciliation.id)
    await this.updateFundingReconciliationTotalAmounts(
      this.fundingReconciliation,
      updatedFundingReconciliationAdjustment
    )

    return this.fundingReconciliation
  }

  private async updateFundingReconciliationAdjustments(
    centreId: number,
    fundingReconciliationId: number
  ) {
    // TODO: consider loading this in the controller.
    const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll({
      where: {
        fundingReconciliationId,
      },
      include: [
        {
          association: "fiscalPeriod",
          attributes: ["dateStart"],
        },
      ],
      order: [["fiscalPeriod", "dateStart", "ASC"]],
    })
    for (const [
      index,
      fundingReconciliationAdjustment,
    ] of fundingReconciliationAdjustments.entries()) {
      const { fiscalPeriodId } = fundingReconciliationAdjustment

      const fundingReceivedPeriodAmount = await CalculateFundingReceivedPeriodAmountService.perform(
        centreId,
        fiscalPeriodId
      )
      const eligibleExpensesPeriodAmount =
        await CalculateEligibleExpensesPeriodAmountService.perform(centreId, fiscalPeriodId)
      const payrollAdjustmentsPeriodAmount =
        await CalculatePayrollAdjustmentsPeriodAmountService.perform(centreId, fiscalPeriodId)
      const cumulativeBalanceAmount = this.determineCumulativeBalanceAmount(
        fundingReconciliationAdjustments,
        index,
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount,
        payrollAdjustmentsPeriodAmount
      )
      await fundingReconciliationAdjustment.update({
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount,
        payrollAdjustmentsPeriodAmount,
        cumulativeBalanceAmount,
      })
    }

    return fundingReconciliationAdjustments
  }

  private determineCumulativeBalanceAmount(
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[],
    index: number,
    fundingReceivedPeriodAmount: string,
    eligibleExpensesPeriodAmount: string,
    payrollAdjustmentsPeriodAmount: string
  ): string {
    let previousCumulativeBalanceAmount = Big("0")

    const previousFundingReconciliationAdjustment = fundingReconciliationAdjustments[index - 1]
    if (previousFundingReconciliationAdjustment) {
      const { cumulativeBalanceAmount } = previousFundingReconciliationAdjustment
      previousCumulativeBalanceAmount = Big(cumulativeBalanceAmount)
    }

    const cumulativeBalanceAmountAsBig = previousCumulativeBalanceAmount
      .plus(Big(fundingReceivedPeriodAmount))
      .minus(Big(eligibleExpensesPeriodAmount))
      .minus(Big(payrollAdjustmentsPeriodAmount))

    return cumulativeBalanceAmountAsBig.toFixed(4)
  }

  // TODO: investigate if this should simply take the last adjustment's data?
  private async updateFundingReconciliationTotalAmounts(
    fundingReconciliation: FundingReconciliation,
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[]
  ) {
    const totalFundingReceived = sumByDecimal(
      fundingReconciliationAdjustments,
      "fundingReceivedPeriodAmount"
    )

    const totalEligibleExpenses = sumByDecimal(
      fundingReconciliationAdjustments,
      "eligibleExpensesPeriodAmount"
    )

    const totalPayrollAdjustments = sumByDecimal(
      fundingReconciliationAdjustments,
      "payrollAdjustmentsPeriodAmount"
    )

    const finalBalanceAmount = totalFundingReceived
      .minus(totalEligibleExpenses)
      .minus(totalPayrollAdjustments)

    await fundingReconciliation.update({
      fundingReceivedTotalAmount: totalFundingReceived.toFixed(4),
      eligibleExpensesTotalAmount: totalEligibleExpenses.toFixed(4),
      payrollAdjustmentsTotalAmount: totalPayrollAdjustments.toFixed(4),
      finalBalanceAmount: finalBalanceAmount.toFixed(4),
    })
  }
}

export default RefreshService
