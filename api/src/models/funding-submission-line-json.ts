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
import { DateTime } from "luxon"
import { upperFirst } from "lodash"

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
  tableName: "funding_submission_line_jsons",
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
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  // Helpers
  static asFundingSubmissionLineJsonMonth(
    date: DateTime | Date | string
  ): FundingSubmissionLineJsonMonths {
    let monthName: string
    if (date instanceof DateTime) {
      monthName = date.toFormat("MMMM")
    } else if (date instanceof Date) {
      const dateAsDateTime = DateTime.fromJSDate(date)
      monthName = dateAsDateTime.toFormat("MMMM")
    } else {
      monthName = upperFirst(date)
    }

    FundingSubmissionLineJson.assertIsValidMonth(monthName)

    return monthName
  }

  static assertIsValidMonth(value: string): asserts value is FundingSubmissionLineJsonMonths {
    if (!FUNDING_SUBMISSION_LINE_JSON_MONTHS.includes(value as FundingSubmissionLineJsonMonths)) {
      throw new Error(`Invalid funding submission line json month: ${value}`)
    }
  }

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
    this.addScope("byFundingPeriod", (fundingPeriodId: number) => {
      const fundingSubmissionLineJsonsByFundingPeriodIdQuery = sql`
        (
          SELECT
            id
          FROM
            funding_submission_line_jsons
          WHERE
            EXISTS (
              SELECT
                1
              FROM
                funding_periods
              WHERE
                funding_periods.id = ${fundingPeriodId}
                AND funding_submission_line_jsons.fiscal_year = REPLACE(
                  funding_periods.fiscal_year,
                  '-' + RIGHT(funding_periods.fiscal_year, 4),
                  '/' + RIGHT(funding_periods.fiscal_year, 2)
                )
            )
        )
      `
      return {
        where: {
          id: {
            [Op.in]: fundingSubmissionLineJsonsByFundingPeriodIdQuery,
          },
        },
      }
    })

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
                  ) AS decimal(10, 2)
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
