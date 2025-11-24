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

@Table({
  paranoid: false,
})
export class WageEnhancement extends Model<
  InferAttributes<WageEnhancement>,
  InferCreationAttributes<WageEnhancement>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare employeeWageTierId: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare employeeName: string

  @Attribute(DataTypes.FLOAT)
  @NotNull
  declare hoursEstimated: number

  @Attribute(DataTypes.FLOAT)
  @NotNull
  declare hoursActual: number

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
