import { QueryTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

// Historical type - values might be numbers or strings
type LegacyFundingLineValue = {
  submissionLineId: number
  sectionName: string
  lineName: string
  monthlyAmount: string | number
  estimatedChildOccupancyRate: string | number
  actualChildOccupancyRate: string | number
  estimatedComputedTotal: string | number
  actualComputedTotal: string | number
}

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

export async function up({ context: queryInterface }: Migration) {
  const BATCH_SIZE = 1000
  let offset = 0
  let hasMore = true

  while (hasMore) {
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
        ORDER BY id
        OFFSET :offset ROWS
        FETCH NEXT :batchSize ROWS ONLY
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          offset,
          batchSize: BATCH_SIZE,
        },
      }
    )

    if (fundingSubmissionLineJsons.length === 0) {
      hasMore = false
      break
    }

    const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
      const values = fundingSubmissionLineJson.values
      const lines = safeJsonParse<LegacyFundingLineValue>(values)

      // Convert numeric values to strings
      const convertedLines = lines.map((line) => {
        let {
          monthlyAmount,
          estimatedChildOccupancyRate,
          actualChildOccupancyRate,
          estimatedComputedTotal,
          actualComputedTotal,
        } = line

        if (typeof monthlyAmount === "number") {
          monthlyAmount = monthlyAmount.toString()
        }

        if (typeof estimatedChildOccupancyRate === "number") {
          estimatedChildOccupancyRate = estimatedChildOccupancyRate.toString()
        }

        if (typeof actualChildOccupancyRate === "number") {
          actualChildOccupancyRate = actualChildOccupancyRate.toString()
        }

        if (typeof estimatedComputedTotal === "number") {
          estimatedComputedTotal = estimatedComputedTotal.toString()
        }

        if (typeof actualComputedTotal === "number") {
          actualComputedTotal = actualComputedTotal.toString()
        }

        return {
          ...line,
          monthlyAmount,
          estimatedChildOccupancyRate,
          actualChildOccupancyRate,
          estimatedComputedTotal,
          actualComputedTotal,
        }
      })

      const stringifiedLines = JSON.stringify(convertedLines)

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

    await Promise.all(promises)
    offset += BATCH_SIZE
  }
}

export async function down({ context: queryInterface }: Migration) {
  const BATCH_SIZE = 1000
  let offset = 0
  let hasMore = true

  while (hasMore) {
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
        ORDER BY id
        OFFSET :offset ROWS
        FETCH NEXT :batchSize ROWS ONLY
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          offset,
          batchSize: BATCH_SIZE,
        },
      }
    )

    if (fundingSubmissionLineJsons.length === 0) {
      hasMore = false
      break
    }

    const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
      const values = fundingSubmissionLineJson.values
      const lines = safeJsonParse<LegacyFundingLineValue>(values)

      // Convert string values back to numbers
      const convertedLines = lines.map((line) => {
        let {
          monthlyAmount,
          estimatedChildOccupancyRate,
          actualChildOccupancyRate,
          estimatedComputedTotal,
          actualComputedTotal,
        } = line

        if (typeof monthlyAmount === "string") {
          monthlyAmount = parseFloat(monthlyAmount)
        }

        if (typeof estimatedChildOccupancyRate === "string") {
          estimatedChildOccupancyRate = parseFloat(estimatedChildOccupancyRate)
        }

        if (typeof actualChildOccupancyRate === "string") {
          actualChildOccupancyRate = parseFloat(actualChildOccupancyRate)
        }

        if (typeof estimatedComputedTotal === "string") {
          estimatedComputedTotal = parseFloat(estimatedComputedTotal)
        }

        if (typeof actualComputedTotal === "string") {
          actualComputedTotal = parseFloat(actualComputedTotal)
        }

        return {
          ...line,
          monthlyAmount,
          estimatedChildOccupancyRate,
          actualChildOccupancyRate,
          estimatedComputedTotal,
          actualComputedTotal,
        }
      })

      const stringifiedLines = JSON.stringify(convertedLines)

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

    await Promise.all(promises)
    offset += BATCH_SIZE
  }
}
