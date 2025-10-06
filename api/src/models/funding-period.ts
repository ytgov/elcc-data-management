import {
  DataTypes,
  Model,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy"

@Table({
  paranoid: false,
})
export class FundingPeriod extends Model<
  InferAttributes<FundingPeriod>,
  InferCreationAttributes<FundingPeriod>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  declare fiscalYear: string

  @Attribute(DataTypes.DATE)
  @NotNull
  declare fromDate: Date

  @Attribute(DataTypes.DATE)
  @NotNull
  declare toDate: Date

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare title: string

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isFiscalYear: CreationOptional<boolean>

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isSchoolMonth: CreationOptional<boolean>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  static establishScopes() {
    // add as needed
  }
}

export default FundingPeriod
