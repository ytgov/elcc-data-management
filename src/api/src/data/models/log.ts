export interface LogDB {
  table_name: string;
  operation: string;
  data: string;
  user: string;
  date: Date;
}

export interface Log {
  table_name: string;
  operation: string;
  data: string;
  user: string;
}
