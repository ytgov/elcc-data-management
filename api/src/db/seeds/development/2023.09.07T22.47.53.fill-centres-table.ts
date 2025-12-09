import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Centre, FundingRegion } from "@/models"

export async function up() {
  const fundingRegion = await FundingRegion.findOne({
    where: {
      region: "Whitehorse",
    },
    rejectOnEmpty: true,
  })

  const centresAttributes: CreationAttributes<Centre>[] = [
    {
      name: "Grow with Joy 2nd",
      license: "123",
      community: "Whitehorse",
      fundingRegionId: fundingRegion.id,
      isFirstNationProgram: false,
      status: "Up to date",
      hotMeal: true,
      licensedFor: 19,
      buildingUsagePercent: "100.00",
      lastSubmission: new Date("2019-01-01"),
    },
    {
      name: "Happy Hearts Preschool",
      license: "456",
      community: "Whitehorse",
      fundingRegionId: fundingRegion.id,
      isFirstNationProgram: false,
      status: "Up to date",
      hotMeal: true,
      licensedFor: 25,
      buildingUsagePercent: "100.00",
      lastSubmission: new Date("2019-01-01"),
    },
  ]

  for (const centreAttributes of centresAttributes) {
    const centre = await Centre.findOne({
      where: {
        fundingRegionId: centreAttributes.fundingRegionId,
        name: centreAttributes.name,
      },
    })

    if (isNil(centre)) {
      await Centre.create(centreAttributes)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
