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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import { isValidFiscalYear } from "@/utils/validators"

import Centre from "@/models/centre"

@Table({
  paranoid: false,
})
export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @ValidateAttribute({
    isValidFiscalYear,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.DATEONLY)
  @NotNull
  declare paidOn: string

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare amountInCents: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare name: string

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
      as: "payments",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  static establishScopes() {
    // add as needed
  }
}

export default Payment
