// This is not a database model.
// It describes the structure of the data in the funding_submission_line_json#values column.
// In the future it might make sense to describe this via a JSON schema.
export interface FundingLineValue {
  submissionLineId: number
  sectionName: string
  lineName: string
  monthlyAmount: string
  estimatedChildOccupancyRate: string
  actualChildOccupancyRate: string
  estimatedComputedTotal: string
  actualComputedTotal: string
}

export default FundingLineValue
