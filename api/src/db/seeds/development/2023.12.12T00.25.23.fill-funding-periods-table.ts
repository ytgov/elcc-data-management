import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingPeriod } from "@/models"
import { CreateService } from "@/services/funding-periods"

export async function up() {
  const fundingPeriodsAttributes: CreationAttributes<FundingPeriod>[] = [
    {
      fiscalYear: "2022-2023",
      fromDate: new Date("2022-04-01"),
      toDate: new Date("2023-03-31"),
      title: "Funding Period 2022-2023",
      isFiscalYear: true,
    },
    {
      fiscalYear: "2023-2024",
      fromDate: new Date("2023-04-01"),
      toDate: new Date("2024-03-31"),
      title: "Funding Period 2023-2024",
      isFiscalYear: true,
    },
    {
      fiscalYear: "2024-2025",
      fromDate: new Date("2024-04-01"),
      toDate: new Date("2025-03-31"),
      title: "Funding Period 2024-2025",
      isFiscalYear: true,
    },
    {
      fiscalYear: "2025-2026",
      fromDate: new Date("2025-04-01"),
      toDate: new Date("2026-03-31"),
      title: "Funding Period 2025-2026",
      isFiscalYear: true,
    },
    {
      fiscalYear: "2026-2027",
      fromDate: new Date("2026-04-01"),
      toDate: new Date("2027-03-31"),
      title: "Funding Period 2026-2027",
      isFiscalYear: true,
    },
  ]

  for (const fundingPeriodAttributes of fundingPeriodsAttributes) {
    const fundingPeriod = await FundingPeriod.findOne({
      where: {
        fiscalYear: fundingPeriodAttributes.fiscalYear,
        isFiscalYear: true,
      },
    })

    if (isNil(fundingPeriod)) {
      await CreateService.perform(fundingPeriodAttributes)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
