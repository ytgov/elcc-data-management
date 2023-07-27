import { type FundingSubmissionLine } from "../data/models"

import { db } from "../data"

export class SubmissionLineService {
  async getAll(query?: any): Promise<FundingSubmissionLine[]> {
    return await db("funding_submission_line").where(query || {})
  }

  async get(id: number): Promise<FundingSubmissionLine | undefined> {
    return await db("funding_submission_line").where({ id }).first()
  }

  update(id: number, period: FundingSubmissionLine) {
    return db("funding_submission_line").where({ id }).update(cleanForUpdate(period))
  }

  create(period: FundingSubmissionLine) {
    return db("funding_submission_line").insert(cleanForUpdate(period))
  }

  delete(id: number) {
    return db("funding_submission_line").where({ id }).delete()
  }
}

function cleanForUpdate(i: any) {
  return {
    fiscal_year: i.fiscal_year,
    section_name: i.section_name,
    line_name: i.line_name,
    from_age: i.from_age,
    to_age: i.to_age,
    monthly_amount: i.monthly_amount,
  }
}
