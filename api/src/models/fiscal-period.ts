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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { DateTime } from "luxon"

import { FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex } from "@/models/indexes"
import { isValidFiscalYearShort } from "@/models/validators"

import BaseModel from "@/models/base-model"
import EmployeeBenefit from "@/models/employee-benefit"
import EmployeeWageTier from "@/models/employee-wage-tier"
import FundingPeriod from "@/models/funding-period"
import FundingReconciliationAdjustment from "@/models/funding-reconciliation-adjustment"
import Payment from "@/models/payment"

/** Keep in sync with web/src/api/fiscal-periods-api.ts */
export enum FiscalPeriodMonths {
  APRIL = "april",
  MAY = "may",
  JUNE = "june",
  JULY = "july",
  AUGUST = "august",
  SEPTEMBER = "september",
  OCTOBER = "october",
  NOVEMBER = "november",
  DECEMBER = "december",
  JANUARY = "january",
  FEBRUARY = "february",
  MARCH = "march",
}

export const FISCAL_PERIOD_MONTHS = Object.values<string>(FiscalPeriodMonths)

/**
 * Represents a monthly period within a FundingPeriod for detailed tracking.
 * Each fiscal period corresponds to a single month (April through March)
 * and is used to break down annual funding reconciliation into monthly
 * components for more granular financial tracking and reporting.
 *
 * TODO: rename to FiscalMonth for clarity - this represents a specific month within a fiscal year
 *
 * @see FundingPeriod - The parent fiscal year that contains these monthly periods
 */
@Table({
  paranoid: false,
})
export class FiscalPeriod extends BaseModel<
  InferAttributes<FiscalPeriod>,
  InferCreationAttributes<FiscalPeriod>
> {
  static readonly Months = FiscalPeriodMonths

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex
  declare fundingPeriodId: number

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex
  @ValidateAttribute({
    isValidFiscalYearShort,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex
  @ValidateAttribute({
    isIn: {
      args: [FISCAL_PERIOD_MONTHS],
      msg: `Month must be one of: ${FISCAL_PERIOD_MONTHS.join(", ")}`,
    },
  })
  declare month: FiscalPeriodMonths

  @Attribute(DataTypes.DATE)
  @NotNull
  declare dateStart: Date

  @Attribute(DataTypes.DATE)
  @NotNull
  declare dateEnd: Date

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Helper functions
  static toShortFiscalYearFormat(fiscalYear: string): string {
    return fiscalYear.replace(/^(\d{4})-(\d{4})$/, (_, startYear, endYear) => {
      return `${startYear}-${endYear.slice(-2)}`
    })
  }

  static asFiscalPeriodMonth(date: DateTime): FiscalPeriodMonths {
    const month = date.toFormat("MMMM").toLowerCase()
    FiscalPeriod.assertIsValidMonth(month)

    return month
  }

  static assertIsValidMonth(value: string): asserts value is FiscalPeriodMonths {
    if (!FISCAL_PERIOD_MONTHS.includes(value)) {
      throw new Error(`Invalid fiscal period month: ${value}`)
    }
  }

  // Associations
  @BelongsTo(() => FundingPeriod, {
    foreignKey: "fundingPeriodId",
    inverse: {
      as: "fiscalPeriods",
      type: "hasMany",
    },
  })
  declare fundingPeriod?: NonAttribute<FundingPeriod>

  @HasMany(() => EmployeeBenefit, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "employeeBenefits",
    },
  })
  declare employeeBenefits?: NonAttribute<EmployeeBenefit[]>

  @HasMany(() => EmployeeWageTier, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "employeeWageTiers",
    },
  })
  declare employeeWageTiers?: NonAttribute<EmployeeWageTier[]>

  @HasMany(() => FundingReconciliationAdjustment, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "fundingReconciliationAdjustments",
    },
  })
  declare fundingReconciliationAdjustments?: NonAttribute<FundingReconciliationAdjustment[]>

  @HasMany(() => Payment, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "payments",
    },
  })
  declare payments?: NonAttribute<Payment[]>

  static establishScopes() {
    // add as needed
  }
}

export default FiscalPeriod
