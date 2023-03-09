export interface CentreSubmission {
  id: number;
  centre_id: number;
  month: string;
  start_date: Date;
  end_date: Date;
  payment: number;
  submitted_by: string;
  submitted_date: Date;
}
