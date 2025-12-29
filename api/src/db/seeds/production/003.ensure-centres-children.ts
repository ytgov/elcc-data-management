import { Centre, FundingPeriod } from "@/models"
import { Centres } from "@/services"

/**
 * REMOVABLE BACKFILL SEED
 *
 * This seed ensures dependencies for existing centres.
 * Can be removed once all centres have their dependencies properly created.
 */
export async function up() {
  await FundingPeriod.findEach(async (fundingPeriod) => {
    await Centre.findEach(async (centre) => {
      await Centres.FundingPeriods.EnsureChildrenService.perform(centre, fundingPeriod)
    })
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
