import type { SeedMigration } from "@/db/umzug"

export const up: SeedMigration = async ({ context: { FiscalPeriod, EmployeeWageTier } }) => {
  const fiscalPeriods = await FiscalPeriod.findAll()

  const tiers = [
    { tierLevel: 0, tierLabel: "Level 0", wageRatePerHour: 0 },
    { tierLevel: 1, tierLabel: "Level 1", wageRatePerHour: 4.12 },
    { tierLevel: 2, tierLabel: "Level 1a", wageRatePerHour: 6.01 },
    { tierLevel: 3, tierLabel: "Level 2", wageRatePerHour: 7.44 },
    { tierLevel: 4, tierLabel: "Level 2a", wageRatePerHour: 9.96 },
    { tierLevel: 5, tierLabel: "Level 3 Exemption", wageRatePerHour: 12.31 },
    { tierLevel: 6, tierLabel: "ECE Level 3", wageRatePerHour: 15.31 },
  ]

  const promises = fiscalPeriods.map(async (fiscalPeriod) => {
    const wageTierPromises = tiers.map(async (tier) => {
      await EmployeeWageTier.findOrCreate({
        where: {
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: tier.tierLevel,
        },
        defaults: {
          ...tier,
          fiscalPeriodId: fiscalPeriod.id,
        },
      })
    })
    return Promise.all(wageTierPromises)
  })

  await Promise.all(promises)
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
