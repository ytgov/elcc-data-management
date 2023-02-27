import { db } from "../data";
import { Centre } from "../data/models";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const TABLE = "centres";

export class CentreService implements GenericService<Centre> {
  async getAll(): Promise<Centre[]> {
    return await db.withSchema(SCHEMA).from(TABLE);
  }

  async create(item: Centre): Promise<any> {
    const result = await db(TABLE).withSchema(SCHEMA).insert(item).returning("*");
    return result[0];
  }

  async update(item: Centre): Promise<any> {
    const result = await db(TABLE).withSchema(SCHEMA).update(item).returning("*");
    return result[0];
  }

  async updateDate(id: string, date: Date): Promise<any> {
    return await db(TABLE).withSchema(SCHEMA).where("id", id).update({ last_submission: date }).returning("*");
  }

  async delete(id: string): Promise<any> {
    return await db(TABLE).withSchema(SCHEMA).where("id", id).del();
  }

  async get(id: string): Promise<Centre> {
    return await db(TABLE).withSchema(SCHEMA).where("id", id).first();
  }
}
