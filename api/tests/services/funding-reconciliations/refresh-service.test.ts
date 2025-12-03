import FiscalPeriod from "@/models/fiscal-period"

import { FundingSubmissionLineJson } from "@/models"

import {
  centreFactory,
  employeeBenefitFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationAdjustmentFactory,
  fundingReconciliationFactory,
  fundingSubmissionLineJsonFactory,
  paymentFactory,
} from "@/factories"

import RefreshService from "@/services/funding-reconciliations/refresh-service"

describe("api/src/services/funding-reconciliations/refresh-service.ts", () => {
  describe("RefreshService", () => {
    describe("#perform", () => {
      test("when there is a payment on first and second months, updates funding reconciliation adjustments with correct cumulative balances", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amount: "150.0",
        })

        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod2.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          fiscalYear: "2025/26",
          paidOn: "2025-05-15",
          amount: "200.0",
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliation.reload({
          include: [
            {
              association: "adjustments",
              include: [
                {
                  association: "fiscalPeriod",
                  attributes: ["dateStart"],
                },
              ],
            },
          ],
          order: [["adjustments", "fiscalPeriod", "dateStart", "ASC"]],
        })
        expect(fundingReconciliation).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "350",
            finalBalanceAmount: "350",
            adjustments: [
              expect.objectContaining({
                fundingReceivedPeriodAmount: "150",
                cumulativeBalanceAmount: "150",
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "200",
                cumulativeBalanceAmount: "350",
              }),
            ],
          })
        )
      })

      test("when there are both payments and eligible expenses across multiple months, calculates correct cumulative balances", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amount: "300.0",
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([{ actualComputedTotal: 100.0 }]),
        })

        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod2.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          fiscalYear: "2025/26",
          paidOn: "2025-05-15",
          amount: "250.0",
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
          values: JSON.stringify([{ actualComputedTotal: 400.0 }]),
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliation.reload({
          include: [
            {
              association: "adjustments",
              include: [
                {
                  association: "fiscalPeriod",
                  attributes: ["dateStart"],
                },
              ],
            },
          ],
          order: [["adjustments", "fiscalPeriod", "dateStart", "ASC"]],
        })
        expect(fundingReconciliation).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "550",
            eligibleExpensesTotalAmount: "500",
            finalBalanceAmount: "50",
            adjustments: [
              expect.objectContaining({
                fundingReceivedPeriodAmount: "300",
                eligibleExpensesPeriodAmount: "100",
                cumulativeBalanceAmount: "200",
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "250",
                eligibleExpensesPeriodAmount: "400",
                cumulativeBalanceAmount: "50",
              }),
            ],
          })
        )
      })

      test("when there are payments, eligible expenses, and employee benefits across multiple months, calculates correct cumulative balances", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amount: "500.0",
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: "150.0",
            },
          ]),
        })
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: "10000",
          grossPayrollMonthlyEstimated: "10000",
          costCapPercentage: "0.02",
          employeeCostActual: "50",
          employeeCostEstimated: "50",
          employerCostActual: "100",
          employerCostEstimated: "100",
        })

        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod2.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          fiscalYear: "2025/26",
          paidOn: "2025-05-15",
          amount: "600.0",
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
          values: JSON.stringify([
            {
              actualComputedTotal: "200.0",
            },
          ]),
        })
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          grossPayrollMonthlyActual: "12000",
          grossPayrollMonthlyEstimated: "12000",
          costCapPercentage: "0.025",
          employeeCostActual: "75",
          employeeCostEstimated: "75",
          employerCostActual: "150",
          employerCostEstimated: "150",
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliation.reload({
          include: [
            {
              association: "adjustments",
              include: [
                {
                  association: "fiscalPeriod",
                  attributes: ["dateStart"],
                },
              ],
            },
          ],
          order: [["adjustments", "fiscalPeriod", "dateStart", "ASC"]],
        })
        expect(fundingReconciliation).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "1100",
            eligibleExpensesTotalAmount: "350",
            payrollAdjustmentsTotalAmount: "250",
            finalBalanceAmount: "500",
            adjustments: [
              expect.objectContaining({
                fundingReceivedPeriodAmount: "500",
                eligibleExpensesPeriodAmount: "150",
                payrollAdjustmentsPeriodAmount: "100",
                cumulativeBalanceAmount: "250",
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "600",
                eligibleExpensesPeriodAmount: "200",
                payrollAdjustmentsPeriodAmount: "150",
                cumulativeBalanceAmount: "500",
              }),
            ],
          })
        )
      })
    })
  })
})
