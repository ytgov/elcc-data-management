export interface FundingPeriod {
  id?: number;
  fiscal_year: string;
  from_date: Date;
  to_date: Date;
  title: string;
  is_fiscal_year: boolean;
  is_school_month: boolean;
}

export interface CentreFundingPeriod {
  id?: number;
  centre_id: number;
  fiscal_period_id: number;
  notes: string;
}

export interface FundingSubmissionLine {
  id?: number;
  fiscal_year: string;
  section_name: string;
  line_name: string;
  from_age: number;
  to_age: number;
  monthly_amount: number;

  age_range?: string;
  monthly_amount_display?: string;
}

export interface FundingSubmissionLineValue {
  id?: number;
  centre_id: number;
  submission_line_id: number;
  fiscal_year: string;
  section_name: string;
  line_name: string;
  date_name: string;
  date_start: Date;
  date_end: Date;
  child_count: number;
  computed_total: number;
  is_actual: boolean;
}

export interface FundingSubmissionLineJson {
  id?: number;
  centre_id: number;
  fiscal_year: string;
  date_name: string;
  date_start: Date;
  date_end: Date;
  values: string;
  lines: FundingLineValue[];
}

export interface FundingLineValue {
  submission_line_id: number;
  section_name: string;
  line_name: string;
  monthly_amount: number;
  est_child_count: number;
  act_child_count: number;
  est_computed_total: number;
  act_computed_total: number;
}
