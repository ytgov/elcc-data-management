import { type FundingSubmissionLineValue } from "../data/models"

import { db } from "../data"

export class SubmissionLineValueService {
  async getAll(query?: any): Promise<FundingSubmissionLineValue[]> {
    return await db("funding_submission_line_value")
      .innerJoin(
        "funding_submission_line",
        "funding_submission_line.id",
        "funding_submission_line_value.submission_line_id"
      )
      .select("funding_submission_line_value.*")
      .select("funding_submission_line.monthly_amount")
      .where(query || {})
  }

  async get(id: number): Promise<FundingSubmissionLineValue | undefined> {
    return await db("funding_submission_line_value").where({ id }).first()
  }

  update(id: number, period: FundingSubmissionLineValue) {
    return db("funding_submission_line_value").where({ id }).update(cleanForUpdate(period))
  }

  create(period: FundingSubmissionLineValue) {
    return db("funding_submission_line_value").insert(cleanForUpdate(period))
  }


  delete(id: number) {
    return db("funding_submission_line_value").where({ id }).delete()
  }
}

function cleanForUpdate(i: any) {
  return {
    centre_id: i.centre_id,
    submission_line_id: i.submission_line_id,
    fiscal_year: i.fiscal_year,
    section_name: i.section_name,
    line_name: i.line_name,
    date_name: i.date_name,
    date_start: i.date_start,
    date_end: i.date_end,
    child_count: i.child_count,
    computed_total: i.computed_total,
    is_actual: i.is_actual,
  }
}
