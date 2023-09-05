// TODO: Check if this should be added as a database model.
// TODO: camel case these after running the appropriate migration.
export interface FundingLineValue {
  submission_line_id: number
  section_name: string
  line_name: string
  monthly_amount: number
  est_child_count: number
  act_child_count: number
  est_computed_total: number
  act_computed_total: number
}
