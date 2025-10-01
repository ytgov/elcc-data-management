import {
  Model,
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

import Centre from "@/models/centre"

@Table({
  paranoid: false,
})
export class CentreFundingPeriod extends Model<
  InferAttributes<CentreFundingPeriod>,
  InferCreationAttributes<CentreFundingPeriod>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  // TODO: rename this column if it doesn't reference a database id;
  // probably to something like fiscalPeriodIdentifier
  // It's generally best to restrict the *Id pattern for database ids and foreign keys
  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fiscalPeriodId: number

  @Attribute(DataTypes.TEXT)
  declare notes: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  // Associations
  @BelongsTo(() => Centre, {
    foreignKey: "centreId",
    inverse: {
      as: "fundingPeriods",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  static establishScopes() {
    // add as needed
  }
}

export default CentreFundingPeriod
