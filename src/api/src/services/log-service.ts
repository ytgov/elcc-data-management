import { db } from "../data";
import { Log, LogDB } from "../data/models";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const TABLE = "logs";

export class LogService implements GenericService<Log> {
  async getAll(): Promise<Log[]> {
    return db.withSchema(SCHEMA).from(TABLE);
  }

  async create(item: Log): Promise<any> {
    const log: LogDB = {
      table_name: item.table_name,
      operation: item.operation,
      data: item.data,
      user: item.user,
      date: new Date()
    };

    return db(TABLE).withSchema(SCHEMA).insert(log);
  }

  async getAllByEmail(email: string): Promise<Log[]> {
    return db.withSchema(SCHEMA).from(TABLE).where("user_email", email);
  }

  async get(id: string): Promise<Log> {
    return db(TABLE).withSchema(SCHEMA).where("id", id).first();
  }
}
