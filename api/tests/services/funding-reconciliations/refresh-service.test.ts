import FiscalPeriod from "@/models/fiscal-period"

import { FundingSubmissionLineJson } from "@/models"

import {
  centreFactory,
  employeeBenefitFactory,
  employeeWageTierFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationAdjustmentFactory,
  fundingReconciliationFactory,
  fundingSubmissionLineJsonFactory,
  paymentFactory,
  wageEnhancementFactory,
} from "@/factories"

import RefreshService from "@/services/funding-reconciliations/refresh-service"

describe("api/src/services/funding-reconciliations/refresh-service.ts", () => {
  describe("RefreshService", () => {
    describe("#perform", () => {
      test("when there are payments, updates funding reconciliation funding received and final balance amounts", async () => {
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
          amountInCents: 150 * 100, // $150.00
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "150.0000",
            finalBalanceAmount: "150.0000",
          })
        )
      })

      test("when there are no payments, updates funding reconciliation funding received and final balance amount to zero", async () => {
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
          fundingReceivedTotalAmount: "1000",
          finalBalanceAmount: "1000",
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

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "0.0000",
            finalBalanceAmount: "0.0000",
          })
        )
      })

      test("when there is a payment on the first month, updates funding reconciliation adjustments for that month", async () => {
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
        const fundingReconciliationAdjustment = await fundingReconciliationAdjustmentFactory.create(
          {
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
          }
        )

        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amountInCents: 150 * 100, // $150.00
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliationAdjustment.reload()
        expect(fundingReconciliationAdjustment).toEqual(
          expect.objectContaining({
            fundingReceivedPeriodAmount: "150",
            cumulativeBalanceAmount: "150",
          })
        )
      })

      test("when there is a payment on first and second months, updates funding reconciliation adjustments for those months, and sets correct cumulative and final balances", async () => {
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
          amountInCents: 150 * 100, // $150.00
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
          amountInCents: 200 * 100, // $200.00
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

      test("when there are eligible expenses, updates funding reconciliation eligible expenses and final balance amounts", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 50.0,
            },
          ]),
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            eligibleExpensesTotalAmount: "50.0000",
            finalBalanceAmount: "-50.0000",
          })
        )
      })

      test("when there are no eligible expenses, updates funding reconciliation eligible expenses to zero", async () => {
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
          eligibleExpensesTotalAmount: "500",
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

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            eligibleExpensesTotalAmount: "0.0000",
            finalBalanceAmount: "0.0000",
          })
        )
      })

      test("when there are payments and eligible expenses, calculates correct final balance with positive result", async () => {
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
          amountInCents: 200 * 100,
        })

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 75.0,
            },
          ]),
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "200.0000",
            eligibleExpensesTotalAmount: "75.0000",
            finalBalanceAmount: "125.0000",
          })
        )
      })

      test("when there are payments and eligible expenses, calculates correct final balance with negative result", async () => {
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
          amountInCents: 100 * 100,
        })

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 250.0,
            },
          ]),
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "100.0000",
            eligibleExpensesTotalAmount: "250.0000",
            finalBalanceAmount: "-150.0000",
          })
        )
      })

      test("when there are eligible expenses on first and second months, updates funding reconciliation adjustments with correct cumulative balances", async () => {
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
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 100.0,
            },
          ]),
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
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
          values: JSON.stringify([
            {
              actualComputedTotal: 150.0,
            },
          ]),
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
            eligibleExpensesTotalAmount: "250",
            finalBalanceAmount: "-250",
            adjustments: [
              expect.objectContaining({
                eligibleExpensesPeriodAmount: "100",
                cumulativeBalanceAmount: "-100",
              }),
              expect.objectContaining({
                eligibleExpensesPeriodAmount: "150",
                cumulativeBalanceAmount: "-250",
              }),
            ],
          })
        )
      })

      test("when there are multiple funding submission line jsons for the same month, sums them correctly", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 30.0,
            },
          ]),
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 70.0,
            },
          ]),
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            eligibleExpensesTotalAmount: "100.0000",
          })
        )
      })

      test("when there are both payments and eligible expenses across multiple months, calculates correct cumulative balances for each month", async () => {
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
          amountInCents: 300 * 100,
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 100.0,
            },
          ]),
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
          amountInCents: 250 * 100,
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
          values: JSON.stringify([
            {
              actualComputedTotal: 400.0,
            },
          ]),
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

      test("when eligible expenses have multiple lines in values array, sums them correctly", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 25.0,
            },
            {
              actualComputedTotal: 35.0,
            },
            {
              actualComputedTotal: 40.0,
            },
          ]),
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            eligibleExpensesTotalAmount: "100.0000",
          })
        )
      })

      test("when there are employee benefits with employerCostActual less than cost cap, uses employerCostActual as payroll adjustment", async () => {
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

        // employerCostActual (100) < grossPayrollMonthlyActual (10000) * costCapPercentage (0.02) = 200
        // So minimum should be 100
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "100.0000",
            finalBalanceAmount: "-100.0000",
          })
        )
      })

      test("when there are employee benefits with cost cap less than employerCostActual, uses cost cap as payroll adjustment", async () => {
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

        // employerCostActual (500) > grossPayrollMonthlyActual (10000) * costCapPercentage (0.03) = 300
        // So minimum should be 300
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.03,
          employeeCostActual: 250,
          employeeCostEstimated: 250,
          employerCostActual: 500,
          employerCostEstimated: 500,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "300.0000",
            finalBalanceAmount: "-300.0000",
          })
        )
      })

      test("when there are no employee benefits, sets payroll adjustments to zero", async () => {
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
          payrollAdjustmentsTotalAmount: "500",
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

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "0.0000",
            finalBalanceAmount: "0.0000",
          })
        )
      })

      test("when there are employee benefits with summed values, calculates payroll adjustment correctly", async () => {
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

        // Employee benefit with summed values: min(400, 25000 * 0.05) = min(400, 1250) = 400
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 25000,
          grossPayrollMonthlyEstimated: 25000,
          costCapPercentage: 0.05,
          employeeCostActual: 200,
          employeeCostEstimated: 200,
          employerCostActual: 400,
          employerCostEstimated: 400,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "400.0000",
            finalBalanceAmount: "-400.0000",
          })
        )
      })

      test("when there are employee benefits across multiple months, updates adjustments correctly", async () => {
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
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
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
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          grossPayrollMonthlyActual: 12000,
          grossPayrollMonthlyEstimated: 12000,
          costCapPercentage: 0.025,
          employeeCostActual: 75,
          employeeCostEstimated: 75,
          employerCostActual: 150,
          employerCostEstimated: 150,
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
            payrollAdjustmentsTotalAmount: "250",
            finalBalanceAmount: "-250",
            adjustments: [
              expect.objectContaining({
                payrollAdjustmentsPeriodAmount: "100",
                cumulativeBalanceAmount: "-100",
              }),
              expect.objectContaining({
                payrollAdjustmentsPeriodAmount: "150",
                cumulativeBalanceAmount: "-250",
              }),
            ],
          })
        )
      })

      test("when there are payments, eligible expenses, and employee benefits, calculates correct final balance", async () => {
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

        // Payment: $1000
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amountInCents: 1000 * 100,
        })

        // Eligible expense: $400
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 400.0,
            },
          ]),
        })

        // Employee benefit payroll adjustment: min(200, 10000 * 0.03) = min(200, 300) = 200
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.03,
          employeeCostActual: 100,
          employeeCostEstimated: 100,
          employerCostActual: 200,
          employerCostEstimated: 200,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        // Final balance = 1000 - 400 - 200 = 400
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "1000.0000",
            eligibleExpensesTotalAmount: "400.0000",
            payrollAdjustmentsTotalAmount: "200.0000",
            finalBalanceAmount: "400.0000",
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

        // Month 1: April
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
          amountInCents: 500 * 100,
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([{ actualComputedTotal: 150.0 }]),
        })
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        // Month 2: May
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
          amountInCents: 600 * 100,
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
          values: JSON.stringify([{ actualComputedTotal: 200.0 }]),
        })
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          grossPayrollMonthlyActual: 12000,
          grossPayrollMonthlyEstimated: 12000,
          costCapPercentage: 0.025,
          employeeCostActual: 75,
          employeeCostEstimated: 75,
          employerCostActual: 150,
          employerCostEstimated: 150,
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
                cumulativeBalanceAmount: "250", // 500 - 150 - 100 = 250
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "600",
                eligibleExpensesPeriodAmount: "200",
                payrollAdjustmentsPeriodAmount: "150",
                cumulativeBalanceAmount: "500", // 250 + 600 - 200 - 150 = 500
              }),
            ],
          })
        )
      })

      test("when there are wage enhancements, includes them in payroll adjustments", async () => {
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

        // Create employee wage tier with known rate
        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // Create wage enhancement: 20 hours * $10/hour = $200 subtotal
        // With EI/CPP/WCB (0.14): $200 * 1.14 = $228
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
          employeeName: "John Doe",
          hoursEstimated: 20,
          hoursActual: 20,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "228.0000",
            finalBalanceAmount: "-228.0000",
          })
        )
      })

      test("when there are no wage enhancements, payroll adjustments include only employee benefits", async () => {
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

        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "100.0000",
            finalBalanceAmount: "-100.0000",
          })
        )
      })

      test("when there are multiple wage enhancements in one period, sums them correctly", async () => {
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

        const employeeWageTier1 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 2,
          tierLabel: "Level 1a",
          wageRatePerHour: 6.0,
        })

        const employeeWageTier2 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // First enhancement: 10 hours * $6/hour = $60
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier1.id,
          employeeName: "Alice Smith",
          hoursEstimated: 10,
          hoursActual: 10,
        })

        // Second enhancement: 15 hours * $10/hour = $150
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier2.id,
          employeeName: "Bob Jones",
          hoursEstimated: 15,
          hoursActual: 15,
        })

        // Subtotal: $60 + $150 = $210
        // With EI/CPP/WCB: $210 * 1.14 = $239.40

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "239.4000",
            finalBalanceAmount: "-239.4000",
          })
        )
      })

      test("when there are both employee benefits and wage enhancements, combines them correctly", async () => {
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

        // Employee benefit: min(100, 10000 * 0.02) = min(100, 200) = 100
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // Wage enhancement: 20 hours * $10/hour * 1.14 = $228
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
          employeeName: "Jane Doe",
          hoursEstimated: 20,
          hoursActual: 20,
        })

        // Total: $100 + $228 = $328

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            payrollAdjustmentsTotalAmount: "328.0000",
            finalBalanceAmount: "-328.0000",
          })
        )
      })

      test("when there are payments, eligible expenses, employee benefits, and wage enhancements, calculates correct final balance", async () => {
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

        // Payment: $1000
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amountInCents: 1000 * 100,
        })

        // Eligible expense: $300
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([{ actualComputedTotal: 300.0 }]),
        })

        // Employee benefit: min(150, 10000 * 0.03) = min(150, 300) = 150
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.03,
          employeeCostActual: 75,
          employeeCostEstimated: 75,
          employerCostActual: 150,
          employerCostEstimated: 150,
        })

        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // Wage enhancement: 10 hours * $10/hour * 1.14 = $114
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
          employeeName: "Test Employee",
          hoursEstimated: 10,
          hoursActual: 10,
        })

        // Payroll adjustments: $150 + $114 = $264
        // Final balance: $1000 - $300 - $264 = $436

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "1000.0000",
            eligibleExpensesTotalAmount: "300.0000",
            payrollAdjustmentsTotalAmount: "264.0000",
            finalBalanceAmount: "436.0000",
          })
        )
      })

      test("when there are wage enhancements across multiple months, calculates correct cumulative balances", async () => {
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

        // Month 1: April
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
          amountInCents: 500 * 100,
        })

        const employeeWageTier1 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // April wage enhancement: 10 hours * $10/hour * 1.14 = $114
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier1.id,
          employeeName: "April Worker",
          hoursEstimated: 10,
          hoursActual: 10,
        })

        // Month 2: May
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
          amountInCents: 600 * 100,
        })

        const employeeWageTier2 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod2.id,
          tierLevel: 4,
          tierLabel: "Level 2a",
          wageRatePerHour: 12.0,
        })

        // May wage enhancement: 15 hours * $12/hour * 1.14 = $205.20
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier2.id,
          employeeName: "May Worker",
          hoursEstimated: 15,
          hoursActual: 15,
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
            payrollAdjustmentsTotalAmount: "319.2",
            finalBalanceAmount: "780.8",
            adjustments: [
              expect.objectContaining({
                fundingReceivedPeriodAmount: "500",
                payrollAdjustmentsPeriodAmount: "114",
                cumulativeBalanceAmount: "386", // 500 - 114 = 386
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "600",
                payrollAdjustmentsPeriodAmount: "205.2",
                cumulativeBalanceAmount: "780.8", // 386 + 600 - 205.2 = 780.8
              }),
            ],
          })
        )
      })
    })
  })
})
