import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Centre, FundingRegion, User } from "@/models"
import { Centres } from "@/services"

export async function up() {
  const systemUser = await User.findOne({
    where: {
      email: "system.user@elcc.com",
    },
    rejectOnEmpty: true,
  })
  const fundingRegion = await FundingRegion.findOne({
    where: {
      region: "Whitehorse",
    },
    rejectOnEmpty: true,
  })
  const centresAttributes: CreationAttributes<Centre>[] = [
    {
      name: "Test Centre",
      license: "123",
      community: "Whitehorse",
      fundingRegionId: fundingRegion.id,
      isFirstNationProgram: false,
      status: "Up to date",
      hotMeal: true,
      licensedFor: 19,
      buildingUsagePercent: "100.00",
      lastSubmission: new Date("2023-01-01"),
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
      await Centres.CreateService.perform(centreAttributes, systemUser)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
