import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export class FiscalPeriod extends Model<
  InferAttributes<FiscalPeriod>,
  InferCreationAttributes<FiscalPeriod>
> {
  declare id: CreationOptional<number>
  declare fiscalYear: string
  declare month: string
  declare dateStart: Date
  declare dateEnd: Date
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

FiscalPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fiscalYear: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateEnd: {
      type: DataTypes.DATE,
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
    indexes: [
      {
        unique: true,
        fields: ["fiscal_year", "month"], // not sure if these need to be snake_case?
      },
    ],
  }
)

export default FiscalPeriod
