/**
 * REMOVABLE BACKFILL SEED
 *
 * This seed ensures dependencies for existing funding periods.
 * Can be removed once all funding periods have their dependencies properly created.
 */

import { FundingPeriod } from "@/models"
import { FundingPeriods } from "@/services"

export async function up() {
  await FundingPeriod.findEach(async (fundingPeriod) => {
    await FundingPeriods.FiscalPeriods.BulkEnsureService.perform(fundingPeriod)
    await FundingPeriods.EmployeeWageTiers.BulkEnsureService.perform(fundingPeriod)
    await FundingPeriods.FundingSubmissionLines.BulkEnsureService.perform(fundingPeriod)
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
