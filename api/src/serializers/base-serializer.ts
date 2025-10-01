import { Model } from "@sequelize/core"

export default class BaseSerializer<T extends Model> {
  protected record: T

  constructor(record: T) {
    this.record = record
  }
}
