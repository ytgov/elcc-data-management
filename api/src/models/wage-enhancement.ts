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

import Centre from "@/models/centre"
import EmployeeWageTier from "@/models/employee-wage-tier"

// TODO: store this in the database, probably in the fiscal_periods table?
// I think having it changeable on a monthly basis would be sufficient?
export const EI_CPP_WCB_RATE = 0.14

@Table({
  paranoid: false,
})
export class WageEnhancement extends Model<
  InferAttributes<WageEnhancement>,
  InferCreationAttributes<WageEnhancement>
> {
  static readonly EI_CPP_WCB_RATE = EI_CPP_WCB_RATE

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  // TODO: consider adding fiscalPeriodId to this model,
  // as it would simplify queries

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare employeeWageTierId: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare employeeName: string

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare hoursEstimated: string

  @Attribute(DataTypes.DECIMAL(10, 2))
  @NotNull
  declare hoursActual: string

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
      as: "wageEnhancements",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  @BelongsTo(() => EmployeeWageTier, {
    foreignKey: "employeeWageTierId",
    inverse: {
      as: "wageEnhancements",
      type: "hasMany",
    },
  })
  declare employeeWageTier?: NonAttribute<EmployeeWageTier>

  static establishScopes() {
    // add as needed
  }
}

export default WageEnhancement
