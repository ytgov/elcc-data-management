import { sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  const EMPLOYEE_BENEFITS_SECTION_NAME = "Employee Benefits"

  // Update funding_submission_line_jsons to remove lines with Employee Benefits section
  // Uses OPENJSON to expand the JSON array, filters out unwanted lines, and rebuilds with FOR JSON
  await queryInterface.sequelize.query(
    sql`
      UPDATE funding_submission_line_jsons
      SET
        [values] = ISNULL(
          (
            SELECT
              JSON_QUERY(values_as_entries.value) AS value
            FROM
              OPENJSON(funding_submission_line_jsons.[values]) AS values_as_entries
            WHERE
              CAST(JSON_VALUE(values_as_entries.value, '$.submissionLineId') AS INT) NOT IN (
                SELECT
                  id
                FROM
                  funding_submission_lines
                WHERE
                  section_name = :sectionName
              )
            FOR JSON
              PATH
          ),
          '[]'
        )
      WHERE
        EXISTS (
          SELECT
            1
          FROM
            OPENJSON(funding_submission_line_jsons.[values]) AS values_as_entries
          WHERE
            CAST(JSON_VALUE(values_as_entries.value, '$.submissionLineId') AS INT) IN (
              SELECT
                id
              FROM
                funding_submission_lines
              WHERE
                section_name = :sectionName
            )
        )
    `,
    {
      replacements: {
        sectionName: EMPLOYEE_BENEFITS_SECTION_NAME,
      },
    }
  )

  // Delete the Employee Benefits funding submission lines
  await queryInterface.sequelize.query(
    sql`
      DELETE FROM funding_submission_lines
      WHERE
        section_name = :sectionName
    `,
    {
      replacements: {
        sectionName: EMPLOYEE_BENEFITS_SECTION_NAME,
      },
    }
  )
}

export async function down({ context: _queryInterface }: Migration) {
  // no-op - this migration is not reversible, it is however idempotent
}
