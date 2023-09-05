
export interface FundingSubmissionLineValue {
  id?: number
  centre_id: number
  submission_line_id: number
  fiscal_year: string
  section_name: string
  line_name: string
  date_name: string
  date_start: Date
  date_end: Date
  child_count: number
  computed_total: number
  is_actual: boolean
}

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
