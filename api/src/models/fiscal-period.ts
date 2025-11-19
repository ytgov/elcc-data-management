import {
  DataTypes,
  Model,
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
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import { FiscalPeriodsFiscalYearMonthUniqueIndex } from "@/models/indexes"
import { isValidFiscalYearShort } from "@/models/validators"

import EmployeeBenefit from "@/models/employee-benefit"
import EmployeeWageTier from "@/models/employee-wage-tier"
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

@Table({
  paranoid: false,
})
export class FiscalPeriod extends Model<
  InferAttributes<FiscalPeriod>,
  InferCreationAttributes<FiscalPeriod>
> {
  static readonly Months = FiscalPeriodMonths

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @FiscalPeriodsFiscalYearMonthUniqueIndex
  @ValidateAttribute({
    isValidFiscalYear: isValidFiscalYearShort,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @FiscalPeriodsFiscalYearMonthUniqueIndex
  @ValidateAttribute({
    isIn: {
      args: [Object.values(FiscalPeriodMonths)],
      msg: `Month must be one of: ${Object.values(FiscalPeriodMonths).join(", ")}`,
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

  // Associations
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
