import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { EmployeeWageTier, FiscalPeriod } from "@/models"

export async function up() {
  const fiscalPeriods = await FiscalPeriod.findAll()

  const employeeWageTiers = [
    { tierLevel: 0, tierLabel: "Level 0", wageRatePerHour: 0 },
    { tierLevel: 1, tierLabel: "Level 1", wageRatePerHour: 4.12 },
    { tierLevel: 2, tierLabel: "Level 1a", wageRatePerHour: 6.01 },
    { tierLevel: 3, tierLabel: "Level 2", wageRatePerHour: 7.44 },
    { tierLevel: 4, tierLabel: "Level 2a", wageRatePerHour: 9.96 },
    { tierLevel: 5, tierLabel: "Level 3 Exemption", wageRatePerHour: 12.31 },
    { tierLevel: 6, tierLabel: "ECE Level 3", wageRatePerHour: 15.31 },
  ]

  const employeeWageTiersAttributes: CreationAttributes<EmployeeWageTier>[] = fiscalPeriods.flatMap(
    (fiscalPeriod) =>
      employeeWageTiers.map((employeeWageTier) => ({
        fiscalPeriodId: fiscalPeriod.id,
        ...employeeWageTier,
      }))
  )

  for (const employeeWageTierAttributes of employeeWageTiersAttributes) {
    const employeeWageTier = await EmployeeWageTier.findOne({
      where: {
        fiscalPeriodId: employeeWageTierAttributes.fiscalPeriodId,
        tierLevel: employeeWageTierAttributes.tierLevel,
      },
    })

    if (isNil(employeeWageTier)) {
      await EmployeeWageTier.create(employeeWageTierAttributes)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
