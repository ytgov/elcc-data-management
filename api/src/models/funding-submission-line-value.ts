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
import FundingSubmissionLine from "@/models/funding-submission-line"

export class FundingSubmissionLineValue extends Model<
  InferAttributes<FundingSubmissionLineValue>,
  InferCreationAttributes<FundingSubmissionLineValue>
> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare submissionLineId: ForeignKey<FundingSubmissionLine["id"]>
  declare fiscalYear: string
  declare sectionName: string
  declare lineName: string
  declare monthlyAmount: number
  declare dateName: string
  declare dateStart: Date
  declare dateEnd: Date
  declare childCount: number
  declare computedTotal: number
  declare isActual: boolean
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare getCentre: BelongsToGetAssociationMixin<Centre>
  declare setCentre: BelongsToSetAssociationMixin<Centre, Centre["id"]>
  declare createCentre: BelongsToCreateAssociationMixin<Centre>

  declare getSubmissionLine: BelongsToGetAssociationMixin<FundingSubmissionLine>
  declare setSubmissionLine: BelongsToSetAssociationMixin<
    FundingSubmissionLine,
    FundingSubmissionLine["id"]
  >
  declare createSubmissionLine: BelongsToCreateAssociationMixin<FundingSubmissionLine>

  declare centre?: NonAttribute<Centre>
  declare submissionLine?: NonAttribute<FundingSubmissionLine>

  declare static associations: {
    centre: Association<FundingSubmissionLineValue, Centre>
    submissionLine: Association<FundingSubmissionLineValue, FundingSubmissionLine>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
    this.belongsTo(FundingSubmissionLine, {
      foreignKey: "submissionLineId",
    })
  }
}

FundingSubmissionLineValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    centreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "centres",
        key: "id",
      },
    },
    submissionLineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "funding_submission_lines",
        key: "id",
      },
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
    // TODO: migrate column to integer cents, see https://github.com/icefoganalytics/elcc-data-management/issues/33
    monthlyAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dateName: {
      type: DataTypes.STRING(100),
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
    // TODO: migrate column to integer; partial children are not possible
    childCount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // TODO: migrate column to integer cents, see https://github.com/icefoganalytics/elcc-data-management/issues/33
    computedTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isActual: {
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

export default FundingSubmissionLineValue
