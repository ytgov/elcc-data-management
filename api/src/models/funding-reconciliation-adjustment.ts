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
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import FiscalPeriod from "@/models/fiscal-period"
import FundingReconciliation from "@/models/funding-reconciliation"

@Table({
  paranoid: false,
})
export class FundingReconciliationAdjustment extends BaseModel<
  InferAttributes<FundingReconciliationAdjustment>,
  InferCreationAttributes<FundingReconciliationAdjustment>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fundingReconciliationId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fiscalPeriodId: number

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare fundingReceivedPeriodAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare eligibleExpensesPeriodAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare payrollAdjustmentsPeriodAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare cumulativeBalanceAmount: CreationOptional<string>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Associations
  @BelongsTo(() => FundingReconciliation, {
    foreignKey: "fundingReconciliationId",
    inverse: {
      as: "adjustments",
      type: "hasMany",
    },
  })
  declare fundingReconciliation?: NonAttribute<FundingReconciliation>

  @BelongsTo(() => FiscalPeriod, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "fundingReconciliationAdjustments",
      type: "hasMany",
    },
  })
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  static establishScopes() {
    // add as needed
  }
}

export default FundingReconciliationAdjustment
