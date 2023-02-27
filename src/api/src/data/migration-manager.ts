import knex, { Knex } from "knex";
import { join } from "path";

export class MigrationManager {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  listMigrations() {
    return this.db.migrate.list({ directory: join(__dirname, "migrations") });
  }

  async migrateUp() {
    console.log("-------- MIGRATE UP ---------");
    return this.db.migrate.up({ directory: join(__dirname, "migrations") });
  }

  async migrateDown() {
    console.log("-------- MIGRATE DOWN ---------");
    return this.db.migrate.down({ directory: join(__dirname, "migrations") });
  }

  async migrateLatest() {
    console.log("-------- MIGRATE LATEST ---------");
    return this.db.migrate.latest({ directory: join(__dirname, "migrations") });
  }

  async seedUp() {
    console.log("-------- SEED UP ---------");
    return this.db.seed.run({ directory: join(__dirname, "seeds") });
  }

  async seedDown() {
    console.log("-------- SEED DOWN ---------");
    return this.db.seed.run({ directory: join(__dirname, "seeds") });
  }
}
