import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"

import sequelize from "@/db/db-client"

export class FundingPeriod extends Model<
  InferAttributes<FundingPeriod>,
  InferCreationAttributes<FundingPeriod>
> {
  declare id: number
  declare fiscalYear: string
  declare fromDate: Date
  declare toDate: Date
  declare title: string
  declare isFiscalYear: boolean
  declare isSchoolMonth: boolean
}

FundingPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: "funding_period", // TODO: remove this once table name is pluralized
    underscored: true,
    timestamps: false,
  }
)

export default FundingPeriod
