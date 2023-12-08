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
import FundingLineValue from "@/models/funding-line-value"

// TODO: consider renaming this to MonthlyWorksheet?
export class FundingSubmissionLineJson extends Model<
  InferAttributes<FundingSubmissionLineJson>,
  InferCreationAttributes<FundingSubmissionLineJson>
> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare fiscalYear: string
  declare dateName: string
  declare dateStart: Date
  declare dateEnd: Date
  declare values: string
  declare lines: CreationOptional<FundingLineValue[]>
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
    centre: Association<FundingSubmissionLineJson, Centre>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
  }
}

FundingSubmissionLineJson.init(
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
    fiscalYear: {
      type: DataTypes.STRING(10),
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
    values: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // TODO: investigate moving these to a get/set on the "values" attribute
    lines: {
      type: DataTypes.VIRTUAL,
      get() {
        return JSON.parse(this.getDataValue("values"))
      },
      set(value: FundingLineValue[]) {
        this.setDataValue("values", JSON.stringify(value))
      },
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

export default FundingSubmissionLineJson
