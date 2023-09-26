import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import FundingSubmissionLineValue from "@/models/funding-submission-line-value"

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

  declare getValues: HasManyGetAssociationsMixin<FundingSubmissionLineValue>
  declare setValues: HasManySetAssociationsMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare hasValue: HasManyHasAssociationMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare hasValues: HasManyHasAssociationsMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare addValue: HasManyAddAssociationMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare addValues: HasManyAddAssociationsMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare removeValue: HasManyRemoveAssociationMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare removeValues: HasManyRemoveAssociationsMixin<
    FundingSubmissionLineValue,
    FundingSubmissionLineValue["submissionLineId"]
  >
  declare countValues: HasManyCountAssociationsMixin
  declare createValue: HasManyCreateAssociationMixin<FundingSubmissionLineValue>

  declare values?: NonAttribute<FundingSubmissionLineValue[]>
  declare static associations: {
    values: Association<FundingSubmissionLine, FundingSubmissionLineValue>
  }

  static establishAssociations() {
    this.hasMany(FundingSubmissionLineValue, {
      sourceKey: "id",
      foreignKey: "submissionLineId",
      as: "values",
    })
  }
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
  },
  {
    sequelize,
    tableName: "funding_submission_line", // TODO: remove this once table name is pluralized
    underscored: true,
    timestamps: false,
  }
)

export default FundingSubmissionLine
