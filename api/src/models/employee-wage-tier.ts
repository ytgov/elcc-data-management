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
  Table,
} from "@sequelize/core/decorators-legacy"

import { EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import FiscalPeriod from "@/models/fiscal-period"
import WageEnhancement from "@/models/wage-enhancement"

@Table({
  paranoid: false,
})
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

  @Attribute(DataTypes.FLOAT)
  @NotNull
  declare wageRatePerHour: number

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

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
    // add as needed
  }
}

export default EmployeeWageTier
