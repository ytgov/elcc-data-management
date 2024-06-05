/**
 * See https://vitest.dev/config/#setupfiles
 *
 * Run some code before each test file.
 */
import db from "@/models"

/*
  e.g.
  EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
  DELETE FROM table1 WHERE 1=1;
  DELETE FROM table2 WHERE 1=1;
  ...
  DBCC CHECKIDENT ('table1', RESEED, 0);
  DBCC CHECKIDENT ('table2', RESEED, 0);
  ...
  EXEC sp_msforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL';
*/
const tableNames = Object.values(db.models).map((model) => model.tableName)
const disableAllConstraintsQuery = "EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';"
const deleteAllInAllTablesQuery = tableNames
  .map((tableName) => `DELETE FROM ${tableName} WHERE 1=1;`)
  .join("\n")
const resetIdentityColumnsQuery = tableNames
  .map((tableName) => `DBCC CHECKIDENT ('${tableName}', RESEED, 0);`)
  .join("\n")
const enableAllConstraintsQuery = "EXEC sp_msforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL';"
const cleanupQuery = [
  disableAllConstraintsQuery,
  deleteAllInAllTablesQuery,
  resetIdentityColumnsQuery,
  enableAllConstraintsQuery,
].join("\n")

async function cleanDatabase() {
  try {
    await db.query(cleanupQuery, { raw: true }).catch(console.error)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

beforeEach(async () => {
  await cleanDatabase()
})
