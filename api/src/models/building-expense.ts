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
} from "@sequelize/core/decorators-legacy"

import { BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import BuildingExpenseCategory from "@/models/building-expense-category"
import Centre from "@/models/centre"
import FiscalPeriod from "@/models/fiscal-period"

export class BuildingExpense extends BaseModel<
  InferAttributes<BuildingExpense>,
  InferCreationAttributes<BuildingExpense>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex
  declare fiscalPeriodId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex
  declare buildingExpenseCategoryId: number

  @Attribute(DataTypes.DECIMAL(5, 4))
  @NotNull
  declare subsidyRate: string

  @Attribute(DataTypes.DECIMAL(5, 2))
  @NotNull
  declare buildingUsagePercent: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare estimatedCost: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare actualCost: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare totalCost: string

  @Attribute(DataTypes.TEXT)
  declare notes: string | null

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
  @BelongsTo(() => Centre, {
    foreignKey: "centreId",
    inverse: {
      as: "buildingExpenses",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  @BelongsTo(() => FiscalPeriod, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "buildingExpenses",
      type: "hasMany",
    },
  })
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  @BelongsTo(() => BuildingExpenseCategory, {
    foreignKey: "buildingExpenseCategoryId",
    inverse: {
      as: "buildingExpenses",
      type: "hasMany",
    },
  })
  declare buildingExpenseCategory?: NonAttribute<BuildingExpenseCategory>

  static establishScopes() {
    // add as needed
  }
}

export default BuildingExpense
