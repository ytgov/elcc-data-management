import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { EmployeeWageTier } from "@/models"

export const TIER_LABEL_EXAMPLES = Object.freeze([
  {
    tierLabel: "Level 0",
    wageRatePerHour: 0.0,
  },
  {
    tierLabel: "Level 1",
    wageRatePerHour: 4.12,
  },
  {
    tierLabel: "Level 1a",
    wageRatePerHour: 6.01,
  },
  {
    tierLabel: "Level 2",
    wageRatePerHour: 7.44,
  },
  {
    tierLabel: "Level 2a",
    wageRatePerHour: 9.96,
  },
  {
    tierLabel: "Level 3 Exemption",
    wageRatePerHour: 12.31,
  },
  {
    tierLabel: "ECE Level 3",
    wageRatePerHour: 15.31,
  },
])

export const employeeWageTierFactory = Factory.define<EmployeeWageTier>(
  ({ sequence, params, onCreate }) => {
    onCreate((employeeWageTier) => employeeWageTier.save())

    assertParamsHasFiscalPeriodId(params)

    const tierLevel = faker.number.int({ min: 0, max: TIER_LABEL_EXAMPLES.length - 1 })
    const { tierLabel, wageRatePerHour } = TIER_LABEL_EXAMPLES[tierLevel]

    return EmployeeWageTier.build({
      id: sequence,
      fiscalPeriodId: params.fiscalPeriodId,
      tierLevel,
      tierLabel,
      wageRatePerHour,
    })
  }
)

function assertParamsHasFiscalPeriodId(
  params: DeepPartial<EmployeeWageTier>
): asserts params is DeepPartial<EmployeeWageTier> & { fiscalPeriodId: number } {
  if (typeof params.fiscalPeriodId !== "number") {
    throw new Error("fiscalPeriodId is must be a number")
  }
}

export default employeeWageTierFactory
