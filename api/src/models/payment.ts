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

import { isValidFiscalYear } from "@/utils/validators"

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare fiscalYear: string
  declare paidOn: Date
  declare amountInCents: number
  declare name: string
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
    centre: Association<Payment, Centre>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
  }
}

Payment.init(
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
        model: "centres", // using real table name here
        key: "id", // using real column name here
      },
    },
    fiscalYear: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: { isValidFiscalYear },
    },
    paidOn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amountInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
  }
)

export default Payment
