import { mapKeys, camelCase, snakeCase } from "lodash"

import type { Migration } from "@/db/umzug"

import { FundingSubmissionLineJson } from "@/models"

function safeJsonParse(values: string): any[] {
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

export const up: Migration = async () => {
  const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse(values)
    const camelizedLines = lines.map((line) => {
      const camelizedObject = mapKeys(line, (_value, key) => camelCase(key))
      return camelizedObject
    })
    const stringifiedLines = JSON.stringify(camelizedLines)
    return fundingSubmissionLineJson.update({ values: stringifiedLines })
  })
  return Promise.all(promises)
}

export const down: Migration = async () => {
  const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse(values)
    const camelizedLines = lines.map((line) => {
      const camelizedObject = mapKeys(line, (_value, key) => snakeCase(key))
      return camelizedObject
    })
    const stringifiedLines = JSON.stringify(camelizedLines)
    return fundingSubmissionLineJson.update({ values: stringifiedLines })
  })
  return Promise.all(promises)
}
