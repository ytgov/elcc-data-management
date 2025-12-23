/**
 * REMOVABLE BACKFILL SEED
 *
 * This seed ensures dependencies for existing funding regions.
 * Can be removed once all funding regions have their dependencies properly created.
 */

import { FundingRegion } from "@/models"
import { FundingRegions } from "@/services"

export async function up() {
  await FundingRegion.findEach(async (fundingRegion) => {
    await FundingRegions.EnsureDependenciesService.perform(fundingRegion)
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
