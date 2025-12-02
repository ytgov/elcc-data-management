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
  Table,
} from "@sequelize/core/decorators-legacy"

import { EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex } from "@/models/indexes"

import BaseModel from "@/models/base-model"
import Centre from "@/models/centre"
import FiscalPeriod from "@/models/fiscal-period"

export const EMPLOYEE_BENEFIT_DEFAULT_COST_CAP_PERCENTAGE = "0.09"

@Table({
  paranoid: false,
})
export class EmployeeBenefit extends BaseModel<
  InferAttributes<EmployeeBenefit>,
  InferCreationAttributes<EmployeeBenefit>
> {
  static readonly DEFAULT_COST_CAP_PERCENTAGE = EMPLOYEE_BENEFIT_DEFAULT_COST_CAP_PERCENTAGE

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex
  declare fiscalPeriodId: number

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare grossPayrollMonthlyActual: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare grossPayrollMonthlyEstimated: string

  @Attribute(DataTypes.DECIMAL(5, 2))
  @NotNull
  declare costCapPercentage: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare employeeCostActual: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare employeeCostEstimated: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare employerCostActual: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare employerCostEstimated: string

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
      as: "employeeBenefits",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  @BelongsTo(() => FiscalPeriod, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "employeeBenefits",
      type: "hasMany",
    },
  })
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  static establishScopes() {
    // add as needed
  }
}

export default EmployeeBenefit
