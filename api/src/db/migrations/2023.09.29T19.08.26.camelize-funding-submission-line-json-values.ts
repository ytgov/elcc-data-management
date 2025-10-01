import { QueryTypes, sql } from "@sequelize/core"
import { mapKeys, camelCase, snakeCase } from "lodash"

import type { Migration } from "@/db/umzug"

function safeJsonParse<T>(values: string): T[] {
  try {
    const lines = JSON.parse(values)
    if (Array.isArray(lines)) {
      return lines
    } else {
      console.error("Parsed value is not an array.")
      return []
    }
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return []
  }
}

export const up: Migration = async ({ context: queryInterface }) => {
  const fundingSubmissionLineJsons = await queryInterface.sequelize.query<{
    id: number
    values: string
  }>(
    sql`
      SELECT
        id,
        [values]
      FROM
        funding_submission_line_jsons
    `,
    {
      type: QueryTypes.SELECT,
    }
  )

  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse<Record<string, unknown>>(values)
    const camelizedLines = lines.map((line) => {
      const camelizedObject = mapKeys(line, (_value, key) => camelCase(key))
      return camelizedObject
    })
    const stringifiedLines = JSON.stringify(camelizedLines)

    return queryInterface.sequelize.query(
      sql`
        UPDATE funding_submission_line_jsons
        SET
          [values] = :updatedValues
        WHERE
          id = :fundingSubmissionLineJsonId
      `,
      {
        replacements: {
          fundingSubmissionLineJsonId: fundingSubmissionLineJson.id,
          updatedValues: stringifiedLines,
        },
      }
    )
  })
  return Promise.all(promises)
}

export const down: Migration = async ({ context: queryInterface }) => {
  const fundingSubmissionLineJsons = await queryInterface.sequelize.query<{
    id: number
    values: string
  }>(
    sql`
      SELECT
        id,
        [values]
      FROM
        funding_submission_line_jsons
    `,
    {
      type: QueryTypes.SELECT,
    }
  )

  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse<Record<string, unknown>>(values)
    const snakeCasedLines = lines.map((line) => {
      const snakeCasedObject = mapKeys(line, (_value, key) => snakeCase(key))
      return snakeCasedObject
    })
    const stringifiedLines = JSON.stringify(snakeCasedLines)

    return queryInterface.sequelize.query(
      sql`
        UPDATE funding_submission_line_jsons
        SET
          [values] = :updatedValues
        WHERE
          id = :fundingSubmissionLineJsonId
      `,
      {
        replacements: {
          fundingSubmissionLineJsonId: fundingSubmissionLineJson.id,
          updatedValues: stringifiedLines,
        },
      }
    )
  })
  return Promise.all(promises)
}
