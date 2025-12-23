import { employeeWageTierFactory, fiscalPeriodFactory, fundingPeriodFactory } from "@/factories"

import BulkCreateService from "@/services/funding-periods/employee-wage-tiers/bulk-create-service"

describe("api/src/services/funding-periods/employee-wage-tiers/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when no employee wage tiers exist, creates tiers from defaults", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-05-01"),
        })

        // Act
        const employeeWageTiers = await BulkCreateService.perform(fundingPeriod)

        // Assert
        expect(employeeWageTiers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 0,
              tierLabel: "Level 0",
              wageRatePerHour: "0",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 1,
              tierLabel: "Level 1",
              wageRatePerHour: "4.12",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 2,
              tierLabel: "Level 1a",
              wageRatePerHour: "6.01",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 3,
              tierLabel: "Level 2",
              wageRatePerHour: "7.44",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 4,
              tierLabel: "Level 2a",
              wageRatePerHour: "9.96",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 5,
              tierLabel: "Level 3 Exemption",
              wageRatePerHour: "12.31",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod1.id,
              tierLevel: 6,
              tierLabel: "ECE Level 3",
              wageRatePerHour: "15.31",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 0,
              tierLabel: "Level 0",
              wageRatePerHour: "0",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 1,
              tierLabel: "Level 1",
              wageRatePerHour: "4.12",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 2,
              tierLabel: "Level 1a",
              wageRatePerHour: "6.01",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 3,
              tierLabel: "Level 2",
              wageRatePerHour: "7.44",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 4,
              tierLabel: "Level 2a",
              wageRatePerHour: "9.96",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 5,
              tierLabel: "Level 3 Exemption",
              wageRatePerHour: "12.31",
            }),
            expect.objectContaining({
              fiscalPeriodId: fiscalPeriod2.id,
              tierLevel: 6,
              tierLabel: "ECE Level 3",
              wageRatePerHour: "15.31",
            }),
          ])
        )
      })

      test("when employee wage tiers exist in another funding period, copies from newest funding period", async () => {
        // Arrange
        const olderFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2023-2024",
          createdAt: new Date("2024-01-01"),
        })
        const olderFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: olderFundingPeriod.id,
          fiscalYear: "2023-24",
          dateStart: new Date("2023-04-01"),
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: olderFiscalPeriod.id,
          tierLevel: 0,
          tierLabel: "Level 0",
          wageRatePerHour: "0",
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: olderFiscalPeriod.id,
          tierLevel: 1,
          tierLabel: "Level 1",
          wageRatePerHour: "4.12",
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: olderFiscalPeriod.id,
          tierLevel: 2,
          tierLabel: "Level 1a",
          wageRatePerHour: "6.01",
        })

        const newerFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          createdAt: new Date("2024-02-01"),
        })
        const newerFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: newerFundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: newerFiscalPeriod.id,
          tierLevel: 0,
          tierLabel: "Level 0",
          wageRatePerHour: "0",
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: newerFiscalPeriod.id,
          tierLevel: 1,
          tierLabel: "Level 1",
          wageRatePerHour: "5.00",
        })
        await employeeWageTierFactory.create({
          fiscalPeriodId: newerFiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: "8.50",
        })

        const targetFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        const targetFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: targetFundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })

        // Act
        const employeeWageTiers = await BulkCreateService.perform(targetFundingPeriod)

        // Assert
        expect(employeeWageTiers).toEqual([
          expect.objectContaining({
            fiscalPeriodId: targetFiscalPeriod.id,
            tierLevel: 0,
            tierLabel: "Level 0",
            wageRatePerHour: "0",
          }),
          expect.objectContaining({
            fiscalPeriodId: targetFiscalPeriod.id,
            tierLevel: 1,
            tierLabel: "Level 1",
            wageRatePerHour: "5",
          }),
          expect.objectContaining({
            fiscalPeriodId: targetFiscalPeriod.id,
            tierLevel: 3,
            tierLabel: "Level 2",
            wageRatePerHour: "8.5",
          }),
        ])
      })

      test("when fiscal periods are missing for target funding period, errors informatively", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })

        // Act & Assert
        expect.assertions(1)
        await expect(BulkCreateService.perform(fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for funding period."
        )
      })
    })
  })
})
