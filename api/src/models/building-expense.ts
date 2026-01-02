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
  BeforeSave,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"
import Big from "big.js"

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

  // TODO: update this field to just be `categoryId`
  @Attribute(DataTypes.INTEGER)
  @NotNull
  @BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex
  declare buildingExpenseCategoryId: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare fundingRegionSnapshot: string

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

  // Hooks
  @BeforeSave
  static updateTotalCost(buildingExpense: BuildingExpense) {
    const actualCostAsBig = new Big(buildingExpense.actualCost || "0")
    const subsidyRateAsBig = new Big(buildingExpense.subsidyRate || "0")
    const buildingUsagePercentAsBig = new Big(buildingExpense.buildingUsagePercent || "0")

    const buildingUsageRatio = buildingUsagePercentAsBig.div(100)
    const totalCostAsBig = actualCostAsBig.times(subsidyRateAsBig).times(buildingUsageRatio)

    buildingExpense.totalCost = totalCostAsBig.toFixed(4)
  }

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
      as: "expenses",
      type: "hasMany",
    },
  })
  declare category?: NonAttribute<BuildingExpenseCategory>

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

export default BuildingExpense
