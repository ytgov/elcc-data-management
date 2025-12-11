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
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import { FundingRegionsRegionUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import BuildingExpenseCategory from "@/models/building-expense-category"
import Centre from "@/models/centre"

export class FundingRegion extends BaseModel<
  InferAttributes<FundingRegion>,
  InferCreationAttributes<FundingRegion>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @FundingRegionsRegionUniqueIndex
  declare region: string

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
  @HasMany(() => Centre, {
    foreignKey: "fundingRegionId",
    inverse: {
      as: "fundingRegion",
    },
  })
  declare centres?: NonAttribute<Centre[]>

  @HasMany(() => BuildingExpenseCategory, {
    foreignKey: "fundingRegionId",
    inverse: {
      as: "fundingRegion",
    },
  })
  declare buildingExpenseCategories?: NonAttribute<BuildingExpenseCategory[]>

  static establishScopes() {
    this.addSearchScope(["region"])

    this.addScope("excludingIds", (fundingRegionIds: string[]) => {
      return {
        where: {
          id: {
            [Op.notIn]: fundingRegionIds,
          },
        },
      }
    })
  }
}

export default FundingRegion
