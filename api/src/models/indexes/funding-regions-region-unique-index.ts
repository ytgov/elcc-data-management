import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const FundingRegionsRegionUniqueIndex = createIndexDecorator(
  "funding-regions-region-unique",
  {
    unique: true,
    name: "unique_funding_regions_on_region",
    where: {
      deletedAt: null,
    },
    msg: "A funding region with this name already exists",
  }
)

export default FundingRegionsRegionUniqueIndex
