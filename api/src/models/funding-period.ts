import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import { isValidFiscalYearLong } from "@/models/validators"

import BaseModel from "@/models/base-model"
import FiscalPeriod from "@/models/fiscal-period"
import FundingReconciliation from "@/models/funding-reconciliation"

/**
 * Represents a fiscal year for funding reconciliation purposes.
 * Each funding period spans from April 1st to March 31st of the following year
 * and is used to track annual government funding allocations and reconciliations
 * for child care centers.
 *
 * TODO: rename to FiscalYear for clarity - this represents an entire fiscal year, not a generic period
 *
 * @see FiscalPeriod - The monthly periods that break down this fiscal year
 */
@Table({
  paranoid: false,
})
export class FundingPeriod extends BaseModel<
  InferAttributes<FundingPeriod>,
  InferCreationAttributes<FundingPeriod>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @ValidateAttribute({
    isValidFiscalYearLong,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.DATE)
  @NotNull
  declare fromDate: Date

  @Attribute(DataTypes.DATE)
  @NotNull
  declare toDate: Date

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare title: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  @HasMany(() => FundingReconciliation, {
    foreignKey: "fundingPeriodId",
    inverse: {
      as: "fundingPeriod",
    },
  })
  declare fundingReconciliations?: NonAttribute<FundingReconciliation[]>

  @HasMany(() => FiscalPeriod, {
    foreignKey: "fundingPeriodId",
    inverse: {
      as: "fundingPeriod",
    },
  })
  declare fiscalPeriods?: NonAttribute<FiscalPeriod[]>

  static establishScopes() {
    this.addSearchScope(["fiscalYear", "title", "fromDate", "toDate"])
  }
}

export default FundingPeriod
