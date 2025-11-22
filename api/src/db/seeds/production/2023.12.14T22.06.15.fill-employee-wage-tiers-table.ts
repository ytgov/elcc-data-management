import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { EmployeeWageTier, FiscalPeriod } from "@/models"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"

export async function up() {
  const fiscalPeriods = await FiscalPeriod.findAll()

  const employeeWageTiersAttributes: CreationAttributes<EmployeeWageTier>[] = fiscalPeriods.flatMap(
    (fiscalPeriod) =>
      EMPLOYEE_WAGE_TIER_DEFAULTS.map((employeeWageTier) => ({
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
