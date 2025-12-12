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

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare monthlyAmount: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Helpers

  /**
   * Converts fiscal year from FundingPeriod format (YYYY-YYYY) to FundingSubmissionLine format (YYYY/YY)
   *
   * @param fiscalYearLong - Fiscal year in long format (e.g., "2023-2024")
   * @returns Fiscal year in legacy format (e.g., "2023/24")
   *
   * @example
   * FundingSubmissionLine.toLegacyFiscalYearFormat("2023-2024") // returns "2023/24"
   */
  static toLegacyFiscalYearFormat(fiscalYearLong: string): string {
    const shortFormat = fiscalYearLong.replace(/^(\d{4})-(\d{4})$/, (_, startYear, endYear) => {
      return `${startYear}-${endYear.slice(-2)}`
    })
    return shortFormat.replace("-", "/")
  }

  static establishScopes() {
    this.addSearchScope(["fiscalYear", "sectionName", "lineName"])
  }
}

export default FundingSubmissionLine
