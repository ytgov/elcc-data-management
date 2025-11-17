import type { Knex } from "knex"

import { buildKnexConfig } from "@/db/db-migration-client"

const config: { [key: string]: Knex.Config } = {
  development: buildKnexConfig(),
  test: buildKnexConfig(),
  production: buildKnexConfig(),
}

export default config
