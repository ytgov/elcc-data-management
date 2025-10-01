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
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy"

import { EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex } from "@/models/indexes"

import Centre from "@/models/centre"
import FiscalPeriod from "@/models/fiscal-period"

@Table({
  paranoid: false,
})
export class EmployeeBenefit extends Model<
  InferAttributes<EmployeeBenefit>,
  InferCreationAttributes<EmployeeBenefit>
> {
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

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare grossPayrollMonthlyActual: number

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare grossPayrollMonthlyEstimated: number

  @Attribute(DataTypes.DECIMAL(5, 2))
  @NotNull
  declare costCapPercentage: number

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare employeeCostActual: number

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare employeeCostEstimated: number

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare employerCostActual: number

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare employerCostEstimated: number

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
