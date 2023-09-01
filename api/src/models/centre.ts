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
import CentreFundingPeriod from "@/models/centre-funding-period"

export enum CentreStatus {
  UP_TO_DATE = "Up to date",
}

export class Centre extends Model<InferAttributes<Centre>, InferCreationAttributes<Centre>> {
  declare id: CreationOptional<number>
  declare name: string
  declare license: string | null
  declare community: string
  declare status: string
  declare hotMeal: boolean | null
  declare licensedFor: number | null // licensed for xx number of children
  declare lastSubmission: Date | null
  declare createDate: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar
  // https://sequelize.org/api/v7/types/_sequelize_core.index.hasmanyaddassociationmixin
  declare getFundingPeriods: HasManyGetAssociationsMixin<CentreFundingPeriod>
  declare setFundingPeriods: HasManySetAssociationsMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare hasFundingPeriod: HasManyHasAssociationMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare hasFundingPeriods: HasManyHasAssociationsMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare addFundingPeriod: HasManyAddAssociationMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare addFundingPeriods: HasManyAddAssociationsMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare removeFundingPeriod: HasManyRemoveAssociationMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare removeFundingPeriods: HasManyRemoveAssociationsMixin<CentreFundingPeriod, CentreFundingPeriod["centreId"]>
  declare countFundingPeriods: HasManyCountAssociationsMixin
  declare createFundingPeriod: HasManyCreateAssociationMixin<CentreFundingPeriod>

  declare fundingPeriods?: NonAttribute<CentreFundingPeriod[]> // where center funding periods assocation gets loaded into

  declare static associations: {
    fundingPeriods: Association<Centre, CentreFundingPeriod>
  }

  static establishasAssociations() {
    this.hasMany(CentreFundingPeriod, {
      sourceKey: "id",
      foreignKey: "centreId",
      as: "fundingPeriods",
    })
  }
}

Centre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    license: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    community: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [Object.values(CentreStatus)],
      },
    },
    hotMeal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    licensedFor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastSubmission: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  }
)

export default Centre
