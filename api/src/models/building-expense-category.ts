import {
  DataTypes,
  Op,
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

import { BuildingExpenseCategoriesFundingRegionIdCategoryNameUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import BuildingExpense from "@/models/building-expense"
import FundingRegion from "@/models/funding-region"

export const BUILDING_EXPENSE_CATEGORY_DEFAULTS = Object.freeze([
  "Rent or Mortgage",
  "Phone",
  "Internet",
  "Cell Phone",
  "Security",
  "Electric",
  "Fuel",
  "Garbage",
  "Snow Removal",
  "Water/Sewer/Taxes",
  "Insurance",
  "Janitorial",
  "Cleaning Supplies",
  "Minor Repairs",
])

export class BuildingExpenseCategory extends BaseModel<
  InferAttributes<BuildingExpenseCategory>,
  InferCreationAttributes<BuildingExpenseCategory>
> {
  static readonly DEFAULTS = BUILDING_EXPENSE_CATEGORY_DEFAULTS

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @BuildingExpenseCategoriesFundingRegionIdCategoryNameUniqueIndex
  declare fundingRegionId: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @BuildingExpenseCategoriesFundingRegionIdCategoryNameUniqueIndex
  declare categoryName: string

  @Attribute(DataTypes.DECIMAL(5, 4))
  @NotNull
  declare subsidyRate: string

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
  @BelongsTo(() => FundingRegion, {
    foreignKey: "fundingRegionId",
    inverse: {
      as: "buildingExpenseCategories",
      type: "hasMany",
    },
  })
  declare fundingRegion?: NonAttribute<FundingRegion>

  @HasMany(() => BuildingExpense, {
    foreignKey: "buildingExpenseCategoryId",
    inverse: {
      as: "category",
    },
  })
  declare expenses?: NonAttribute<BuildingExpense[]>

  static establishScopes() {
    this.addSearchScope(["categoryName"])

    this.addScope("excludingIds", (buildingExpenseCategoryIds: string[]) => {
      return {
        where: {
          id: {
            [Op.notIn]: buildingExpenseCategoryIds,
          },
        },
      }
    })
  }
}

export default BuildingExpenseCategory
