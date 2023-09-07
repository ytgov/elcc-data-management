import { UmzugStorage } from "umzug"

export class UmzugNullStorage implements UmzugStorage {
  async executed(): Promise<string[]> {
    return []
  }

  async logMigration(): Promise<void> {}

  async unlogMigration(): Promise<void> {}
}
