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
} from "@sequelize/core/decorators-legacy"

import { EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import FiscalPeriod from "@/models/fiscal-period"
import WageEnhancement from "@/models/wage-enhancement"

export type EmployeeWageTierDefault = Pick<
  EmployeeWageTier,
  "tierLevel" | "tierLabel" | "wageRatePerHour"
>

// TODO: make these end user editable, or clone forward when creating?
export const EMPLOYEE_WAGE_TIER_DEFAULTS: ReadonlyArray<EmployeeWageTierDefault> = Object.freeze([
  { tierLevel: 0, tierLabel: "Level 0", wageRatePerHour: "0" },
  { tierLevel: 1, tierLabel: "Level 1", wageRatePerHour: "4.12" },
  { tierLevel: 2, tierLabel: "Level 1a", wageRatePerHour: "6.01" },
  { tierLevel: 3, tierLabel: "Level 2", wageRatePerHour: "7.44" },
  { tierLevel: 4, tierLabel: "Level 2a", wageRatePerHour: "9.96" },
  { tierLevel: 5, tierLabel: "Level 3 Exemption", wageRatePerHour: "12.31" },
  { tierLevel: 6, tierLabel: "ECE Level 3", wageRatePerHour: "15.31" },
])

// TODO: consider if these should be mapped directly to a funding period rather than a fiscal period?
// Then employee benefits would denormalize the data at creation time on a per-fiscal period basis.
export class EmployeeWageTier extends BaseModel<
  InferAttributes<EmployeeWageTier>,
  InferCreationAttributes<EmployeeWageTier>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex
  declare fiscalPeriodId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex
  declare tierLevel: number

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare tierLabel: string

  @Attribute(DataTypes.DECIMAL(10, 4))
  @NotNull
  declare wageRatePerHour: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => FiscalPeriod, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "employeeWageTiers",
      type: "hasMany",
    },
  })
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  @HasMany(() => WageEnhancement, {
    foreignKey: "employeeWageTierId",
    inverse: {
      as: "employeeWageTier",
    },
  })
  declare wageEnhancements?: NonAttribute<WageEnhancement[]>

  static establishScopes() {
    this.addScope("byFundingPeriod", (fundingPeriodId: number) => ({
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId,
          },
        },
      ],
    }))
  }
}

export default EmployeeWageTier
