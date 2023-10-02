import { invert, mapKeys } from "lodash"

import type { Migration } from "@/db/umzug"

import { FundingSubmissionLineJson } from "@/models"
import safeJsonParse from "@/db/utils/safe-parse-json"

const OLD_TO_NEW_KEY_MAP: Readonly<Record<string, string>> = Object.freeze({
  estChildCount: "estimatedChildOccupancyRate",
  actChildCount: "actualChildOccupancyRate",
  estComputedTotal: "estimatedComputedTotal",
  actComputedTotal: "actualComputedTotal",
})

const NEW_TO_OLD_KEY_MAP: Readonly<Record<string, string>> = Object.freeze(
  invert(OLD_TO_NEW_KEY_MAP)
)

export const up: Migration = async () => {
  const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse(values)
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
    return fundingSubmissionLineJson.update({ values: stringifiedLines })
  })
  return Promise.all(promises)
}

export const down: Migration = async () => {
  const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
  const promises = fundingSubmissionLineJsons.map(async (fundingSubmissionLineJson) => {
    const values = fundingSubmissionLineJson.values
    const lines = safeJsonParse(values)
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
    return fundingSubmissionLineJson.update({ values: stringifiedLines })
  })
  return Promise.all(promises)
}
