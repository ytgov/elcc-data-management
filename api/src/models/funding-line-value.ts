// This is not a database model.
// It describes the structure of the data in the funding_submission_line_json#values column.
// In the future it might make sense to describe this via a JSON schema.
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
