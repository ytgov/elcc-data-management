import { db } from "../data";
import { Centre } from "../data/models";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const TABLE = "centres";

export class CentreService implements GenericService<Centre> {
  async getAll(): Promise<Centre[]> {
    return db.withSchema(SCHEMA).from(TABLE);
  }

  async create(item: Centre): Promise<any> {
    return db(TABLE).withSchema(SCHEMA).insert(item);
  }

  async update(item: Centre): Promise<any> {
    return db(TABLE).withSchema(SCHEMA).update(item);
  }

  async updateDate(id: string, date: Date): Promise<any> {
    return db(TABLE).withSchema(SCHEMA).where("id", id).update({ last_submission: date });
  }

  async delete(id: string): Promise<any> {
    return db(TABLE).withSchema(SCHEMA).where("id", id).del();
  }

  async get(id: string): Promise<Centre> {
    return db(TABLE).withSchema(SCHEMA).where("id", id).first();
  }
}
