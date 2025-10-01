import { QueryTypes, sql } from "@sequelize/core"
import { invert, mapKeys } from "lodash"

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

const OLD_TO_NEW_KEY_MAP: Readonly<Record<string, string>> = Object.freeze({
  estChildCount: "estimatedChildOccupancyRate",
  actChildCount: "actualChildOccupancyRate",
  estComputedTotal: "estimatedComputedTotal",
  actComputedTotal: "actualComputedTotal",
})

const NEW_TO_OLD_KEY_MAP: Readonly<Record<string, string>> = Object.freeze(
  invert(OLD_TO_NEW_KEY_MAP)
)

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
    const updatedLines = lines.map((line) => {
      const lineWithUpdatedKeys = mapKeys(line, (_value, key) => {
        if (key in OLD_TO_NEW_KEY_MAP) {
          return OLD_TO_NEW_KEY_MAP[key]
        } else {
          return key
        }
      })
      return lineWithUpdatedKeys
    })
    const stringifiedLines = JSON.stringify(updatedLines)
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
    const updatedLines = lines.map((line) => {
      const lineWithUpdatedKeys = mapKeys(line, (_value, key) => {
        if (key in NEW_TO_OLD_KEY_MAP) {
          return NEW_TO_OLD_KEY_MAP[key]
        } else {
          return key
        }
      })
      return lineWithUpdatedKeys
    })
    const stringifiedLines = JSON.stringify(updatedLines)
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
