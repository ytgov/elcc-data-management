import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export class FundingPeriod extends Model<
  InferAttributes<FundingPeriod>,
  InferCreationAttributes<FundingPeriod>
> {
  declare id: CreationOptional<number>
  declare fiscalYear: string
  declare fromDate: Date
  declare toDate: Date
  declare title: string
  declare isFiscalYear: boolean
  declare isSchoolMonth: boolean
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

FundingPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fiscalYear: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isFiscalYear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isSchoolMonth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

export default FundingPeriod
