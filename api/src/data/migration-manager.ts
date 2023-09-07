import { type Knex } from "knex"
import { join } from "path"

export class MigrationManager {
  private readonly db: Knex

  constructor(db: Knex) {
    this.db = db
  }

  async seedUp() {
    console.log("-------- SEED UP ---------")
    return await this.db.seed.run({ directory: join(__dirname, "seeds") })
  }

  async seedDown() {
    console.log("-------- SEED DOWN ---------")
    return await this.db.seed.run({ directory: join(__dirname, "seeds") })
  }
}
