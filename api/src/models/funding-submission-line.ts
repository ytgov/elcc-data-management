import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export class FundingSubmissionLine extends Model<
  InferAttributes<FundingSubmissionLine>,
  InferCreationAttributes<FundingSubmissionLine>
> {
  declare id: CreationOptional<number>
  declare fiscalYear: string
  declare sectionName: string
  declare lineName: string
  declare fromAge: number | null
  declare toAge: number | null
  declare monthlyAmount: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

FundingSubmissionLine.init(
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
    sectionName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    lineName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    fromAge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    toAge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // TODO: migrate column to integer cents, see https://github.com/icefoganalytics/elcc-data-management/issues/33
    monthlyAmount: {
      type: DataTypes.FLOAT,
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

export default FundingSubmissionLine
