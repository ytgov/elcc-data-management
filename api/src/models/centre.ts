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
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import CentreFundingPeriod from "@/models/centre-funding-period"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"
import BaseModel from "@/models/base-model"

export enum CentreStatus {
  UP_TO_DATE = "Up to date",
}

// Keep in sync with web/src/api/centres-api.ts
export enum CentreRegions {
  WHITEHORSE = "whitehorse",
  COMMUNITIES = "communities",
}

export class Centre extends BaseModel<InferAttributes<Centre>, InferCreationAttributes<Centre>> {
  static readonly Regions = CentreRegions

  declare id: CreationOptional<number>
  declare name: string
  declare community: string
  declare region: string
  declare status: string
  declare isFirstNationProgram: boolean
  declare license: CreationOptional<string | null>
  declare hotMeal: CreationOptional<boolean | null>
  declare licensedFor: CreationOptional<number | null> // licensed for xx number of children
  declare licenseHolderName: CreationOptional<string | null>
  declare contactName: CreationOptional<string | null>
  declare physicalAddress: CreationOptional<string | null>
  declare mailingAddress: CreationOptional<string | null>
  declare email: CreationOptional<string | null>
  declare altEmail: CreationOptional<string | null>
  declare phoneNumber: CreationOptional<string | null>
  declare altPhoneNumber: CreationOptional<string | null>
  declare faxNumber: CreationOptional<string | null>
  declare vendorIdentifier: CreationOptional<string | null>
  declare inspectorName: CreationOptional<string | null>
  declare neighborhood: CreationOptional<string | null>
  declare lastSubmission: CreationOptional<Date | null>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar
  // https://sequelize.org/api/v7/types/_sequelize_core.index.hasmanyaddassociationmixin
  declare getFundingPeriods: HasManyGetAssociationsMixin<CentreFundingPeriod>
  declare setFundingPeriods: HasManySetAssociationsMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare hasFundingPeriod: HasManyHasAssociationMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare hasFundingPeriods: HasManyHasAssociationsMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare addFundingPeriod: HasManyAddAssociationMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare addFundingPeriods: HasManyAddAssociationsMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare removeFundingPeriod: HasManyRemoveAssociationMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare removeFundingPeriods: HasManyRemoveAssociationsMixin<
    CentreFundingPeriod,
    CentreFundingPeriod["centreId"]
  >
  declare countFundingPeriods: HasManyCountAssociationsMixin
  declare createFundingPeriod: HasManyCreateAssociationMixin<CentreFundingPeriod>

  declare getFundingSubmissionLineJsons: HasManyGetAssociationsMixin<FundingSubmissionLineJson>
  declare setFundingSubmissionLineJsons: HasManySetAssociationsMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare hasFundingSubmissionLineJson: HasManyHasAssociationMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare hasFundingSubmissionLineJsons: HasManyHasAssociationsMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare addFundingSubmissionLineJson: HasManyAddAssociationMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare addFundingSubmissionLineJsons: HasManyAddAssociationsMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare removeFundingSubmissionLineJson: HasManyRemoveAssociationMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare removeFundingSubmissionLineJsons: HasManyRemoveAssociationsMixin<
    FundingSubmissionLineJson,
    FundingSubmissionLineJson["centreId"]
  >
  declare countFundingSubmissionLineJsons: HasManyCountAssociationsMixin
  declare createFundingSubmissionLineJson: HasManyCreateAssociationMixin<FundingSubmissionLineJson>

  declare fundingPeriods?: NonAttribute<CentreFundingPeriod[]>
  declare fundingSubmissionLineJsons?: NonAttribute<FundingSubmissionLineJson[]>
  declare static associations: {
    fundingPeriods: Association<Centre, CentreFundingPeriod>
    fundingSubmissionLineJsons: Association<Centre, FundingSubmissionLineJson>
  }

  static establishAssociations() {
    this.hasMany(CentreFundingPeriod, {
      sourceKey: "id",
      foreignKey: "centreId",
      as: "fundingPeriods",
    })
    this.hasMany(FundingSubmissionLineJson, {
      sourceKey: "id",
      foreignKey: "centreId",
      as: "fundingSubmissionLineJsons",
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
    community: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isFirstNationProgram: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [Object.values(CentreRegions)],
      },
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [Object.values(CentreStatus)],
      },
    },
    license: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hotMeal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    licensedFor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    licenseHolderName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    physicalAddress: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    mailingAddress: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    altEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    altPhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    faxNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    vendorIdentifier: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    inspectorName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastSubmission: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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

export default Centre
