// TODO: Check if this should be added as a database model.
// TODO: camel case these after running the appropriate migration.
export interface FundingLineValue {
  submissionLineId: number
  sectionName: string
  lineName: string
  monthlyAmount: number
  estChildCount: number
  actChildCount: number
  estComputedTotal: number
  actComputedTotal: number
}
