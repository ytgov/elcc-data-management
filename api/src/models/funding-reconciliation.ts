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
  HasMany,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import Centre from "@/models/centre"
import FundingPeriod from "@/models/funding-period"
import FundingReconciliationAdjustment from "@/models/funding-reconciliation-adjustment"
import User from "@/models/user"

export enum FundingReconciliationStatuses {
  DRAFT = "draft",
  FINALIZED = "finalized",
}

export const FUNDING_RECONCILIATION_STATUSES = Object.values(FundingReconciliationStatuses)

export class FundingReconciliation extends BaseModel<
  InferAttributes<FundingReconciliation>,
  InferCreationAttributes<FundingReconciliation>
> {
  static readonly Statuses = FundingReconciliationStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fundingPeriodId: number

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Default(FundingReconciliationStatuses.DRAFT)
  @ValidateAttribute({
    isIn: {
      args: [FUNDING_RECONCILIATION_STATUSES],
      msg: `Status must be one of: ${FUNDING_RECONCILIATION_STATUSES.join(", ")}`,
    },
  })
  declare status: FundingReconciliationStatuses

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare fundingReceivedTotalAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare eligibleExpensesTotalAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare payrollAdjustmentsTotalAmount: CreationOptional<string>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  @Default(0)
  declare finalBalanceAmount: CreationOptional<string>

  @Attribute(DataTypes.TEXT)
  declare notes: string | null

  @Attribute(DataTypes.DATE)
  declare finalizedAt: Date | null

  @Attribute(DataTypes.INTEGER)
  declare finalizedById: number | null

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  // Helpers
  get isDraftState(): NonAttribute<boolean> {
    return this.status === FundingReconciliationStatuses.DRAFT
  }

  // Associations
  @BelongsTo(() => Centre, {
    foreignKey: "centreId",
    inverse: {
      as: "fundingReconciliations",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  @BelongsTo(() => FundingPeriod, {
    foreignKey: "fundingPeriodId",
    inverse: {
      as: "fundingReconciliations",
      type: "hasMany",
    },
  })
  declare fundingPeriod?: NonAttribute<FundingPeriod>

  @BelongsTo(() => User, {
    foreignKey: "finalizedById",
    inverse: {
      as: "finalizedReconciliations",
      type: "hasMany",
    },
  })
  declare finalizedBy?: NonAttribute<User>

  @HasMany(() => FundingReconciliationAdjustment, {
    foreignKey: "fundingReconciliationId",
    inverse: {
      as: "fundingReconciliation",
    },
  })
  declare adjustments?: NonAttribute<FundingReconciliationAdjustment[]>

  static establishScopes() {
    // add as needed
  }
}

export default FundingReconciliation
