import { FundingPeriod } from "../data/models";

import { db } from "../data";

export class FundingPeriodService {
  getAll(query?: any): Promise<FundingPeriod[]> {
    return db("funding_period").where(query || {});
  }

  get(id: number): Promise<FundingPeriod | undefined> {
    return db("funding_period").where({ id }).first();
  }

  update(id: number, period: FundingPeriod) {
    return db("funding_period").where({ id }).update(cleanForUpdate(period));
  }

  create(period: FundingPeriod) {
    return db("funding_period").insert(cleanForUpdate(period));
  }

  delete(id: number) {
    return db("funding_period").where({ id }).delete();
  }
}

function cleanForUpdate(i: any) {
  return { ...i };
}
