import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import Centre from "@/models/centre"

export class CentreFundingPeriod extends Model<
  InferAttributes<CentreFundingPeriod>,
  InferCreationAttributes<CentreFundingPeriod>
> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare fiscalPeriodId: number
  declare notes: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getCentre: BelongsToGetAssociationMixin<Centre>
  declare setCentre: BelongsToSetAssociationMixin<Centre, Centre["id"]>
  declare createCentre: BelongsToCreateAssociationMixin<Centre>

  declare centre?: NonAttribute<Centre>

  declare static associations: {
    centre: Association<CentreFundingPeriod, Centre>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
  }
}

CentreFundingPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    centreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "centres",
        key: "id",
      },
    },
    // TODO: rename this column if it doesn't reference a database id;
    // probably to something like fiscalPeriodIdentifier
    // It's generally best to restrict the *Id pattern for database ids and foreign keys
    fiscalPeriodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "centre_funding_period", // TODO: remove this once table name is pluralized
    underscored: true,
  }
)

export default CentreFundingPeriod
