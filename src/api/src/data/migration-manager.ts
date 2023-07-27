import knex, { type Knex } from "knex";
import { join } from "path";

export class MigrationManager {
  private readonly db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async listMigrations() {
    return await this.db.migrate.list({ directory: join(__dirname, "migrations") });
  }

  async migrateUp() {
    console.log("-------- MIGRATE UP ---------");
    return await this.db.migrate.up({ directory: join(__dirname, "migrations") });
  }

  async migrateDown() {
    console.log("-------- MIGRATE DOWN ---------");
    return await this.db.migrate.down({ directory: join(__dirname, "migrations") });
  }

  async migrateLatest() {
    console.log("-------- MIGRATE LATEST ---------");
    return await this.db.migrate.latest({ directory: join(__dirname, "migrations") });
  }

  async seedUp() {
    console.log("-------- SEED UP ---------");
    return await this.db.seed.run({ directory: join(__dirname, "seeds") });
  }

  async seedDown() {
    console.log("-------- SEED DOWN ---------");
    return await this.db.seed.run({ directory: join(__dirname, "seeds") });
  }
}
