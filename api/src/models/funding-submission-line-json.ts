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
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import { isValidFiscalYearLegacy } from "@/models/validators"

import BaseModel from "@/models/base-model"
import Centre from "@/models/centre"
import FundingLineValue from "@/models/funding-line-value"

export enum FundingSubmissionLineJsonMonths {
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
}

const FUNDING_SUBMISSION_LINE_JSON_MONTHS = Object.values(FundingSubmissionLineJsonMonths)

// TODO: consider renaming this to MonthlyWorksheet?
// TODO: link this model to a fiscal period, and remove fiscalYear, dateName, dateStart, and dateEnd
@Table({
  paranoid: false,
})
export class FundingSubmissionLineJson extends BaseModel<
  InferAttributes<FundingSubmissionLineJson>,
  InferCreationAttributes<FundingSubmissionLineJson>
> {
  static readonly Months = FundingSubmissionLineJsonMonths

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  // TODO: normalize to url safe long-form fiscal year 2023-2024
  @Attribute(DataTypes.STRING(10))
  @NotNull
  @ValidateAttribute({
    isValidFiscalYearLegacy,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [FUNDING_SUBMISSION_LINE_JSON_MONTHS],
      msg: `Month must be one of: ${FUNDING_SUBMISSION_LINE_JSON_MONTHS.join(", ")}`,
    },
  })
  declare dateName: FundingSubmissionLineJsonMonths

  @Attribute(DataTypes.DATE)
  @NotNull
  declare dateStart: Date

  @Attribute(DataTypes.DATE)
  @NotNull
  declare dateEnd: Date

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare values: string

  @Attribute({
    type: DataTypes.VIRTUAL(DataTypes.STRING, ["values"]),
    get() {
      return JSON.parse(this.getDataValue("values"))
    },
    set(value: FundingLineValue[]) {
      this.setDataValue("values", JSON.stringify(value))
    },
  })
  declare lines: CreationOptional<FundingLineValue[]>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Associations
  @BelongsTo(() => Centre, {
    foreignKey: "centreId",
    inverse: {
      as: "fundingSubmissionLineJsons",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  static establishScopes() {
    this.addScope("withChildOccupancyRate", (sectionName: string) => {
      const withChildOccupancyRateQuery = sql`
        (
          SELECT
            funding_submission_line_jsons.id
          FROM
            funding_submission_line_jsons
            CROSS APPLY OPENJSON (funding_submission_line_jsons.[values]) AS json_array_element
          WHERE
            JSON_VALUE(json_array_element.value, '$.sectionName') = :sectionName
          GROUP BY
            funding_submission_line_jsons.id,
            JSON_VALUE(json_array_element.value, '$.sectionName')
          HAVING
            SUM(
              COALESCE(
                TRY_CAST(
                  JSON_VALUE(
                    json_array_element.value,
                    '$.actualChildOccupancyRate'
                  ) AS int
                ),
                0
              )
            ) > 0
        )
      `
      return {
        where: {
          id: {
            [Op.in]: withChildOccupancyRateQuery,
          },
        },
        replacements: {
          sectionName,
        },
      }
    })
  }
}

export default FundingSubmissionLineJson
