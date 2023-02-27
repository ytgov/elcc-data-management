export interface LogDB {
  table_name: string;
  operation: string;
  data: string;
  user_email: string;
  date: Date;
}

export interface Log {
  table_name: string;
  operation: string;
  data: string;
  user_email: string;
}
