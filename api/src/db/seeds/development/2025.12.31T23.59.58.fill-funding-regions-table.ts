import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingRegion } from "@/models"

export async function up() {
  const fundingRegionsAttributes: CreationAttributes<FundingRegion>[] = [
    { region: "whitehorse", subsidyRate: "0.3700" },
    { region: "communities", subsidyRate: "0.3700" },
  ]

  for (const fundingRegionAttributes of fundingRegionsAttributes) {
    const fundingRegion = await FundingRegion.findOne({
      where: {
        region: fundingRegionAttributes.region,
      },
    })

    if (isNil(fundingRegion)) {
      await FundingRegion.create(fundingRegionAttributes)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
