import { db } from "../data";
import { CentreSubmission } from "../data/models";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const TABLE = "centre_submissions";

export class CentreSubmissionService implements GenericService<CentreSubmission> {
  async getAll(): Promise<CentreSubmission[]> {
    return await db.withSchema(SCHEMA).from(TABLE);
  }

  async getByCentreId(centreId: number): Promise<CentreSubmission[]> {
    return await db.withSchema(SCHEMA).from(TABLE).where("centre_id", centreId);
  }

  async create(item: CentreSubmission): Promise<any> {
    const result = await db(TABLE).withSchema(SCHEMA).insert(item).returning("*");
    return result[0];
  }

  async update(item: CentreSubmission): Promise<any> {
    const result = await db(TABLE).withSchema(SCHEMA).update(item).returning("*");
    return result[0];
  }

  async delete(id: string): Promise<any> {
    return await db(TABLE).withSchema(SCHEMA).where("id", id).del();
  }

  async get(id: string): Promise<CentreSubmission> {
    return await db(TABLE).withSchema(SCHEMA).where("id", id).first();
  }
}
