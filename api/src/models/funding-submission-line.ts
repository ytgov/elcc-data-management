import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import { isValidFiscalYearLegacy } from "@/models/validators"

import BaseModel from "@/models/base-model"

@Table({
  paranoid: false,
})
export class FundingSubmissionLine extends BaseModel<
  InferAttributes<FundingSubmissionLine>,
  InferCreationAttributes<FundingSubmissionLine>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  // TODO: replace with foreign key to FundingPeriod model.
  @Attribute(DataTypes.STRING(10))
  @NotNull
  @ValidateAttribute({
    isValidFiscalYearLegacy,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare sectionName: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare lineName: string

  @Attribute(DataTypes.INTEGER)
  declare fromAge: number | null

  @Attribute(DataTypes.INTEGER)
  declare toAge: number | null

  // TODO: migrate column to DataTypes.DECIMAL(19, 4), see https://github.com/icefoganalytics/elcc-data-management/issues/33
  @Attribute(DataTypes.FLOAT)
  @NotNull
  declare monthlyAmount: number

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  static establishScopes() {
    this.addSearchScope(["fiscalYear", "sectionName", "lineName"])
  }
}

export default FundingSubmissionLine
