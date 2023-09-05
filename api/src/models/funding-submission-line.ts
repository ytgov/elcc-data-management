import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"

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
    monthlyAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "funding_submission_line", // TODO: remove this once table name is pluralized
    underscored: true,
    timestamps: false,
  }
)

export default FundingSubmissionLine
