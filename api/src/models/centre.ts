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
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"

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
  declare licenseHolderName: string | null
  declare contactName: string | null
  declare physicalAddress: string | null
  declare mailingAddress: string | null
  declare email: string | null
  declare altEmail: string | null
  declare phoneNumber: string | null
  declare altPhoneNumber: string | null
  declare faxNumber: string | null
  declare vendorIdentifier: string | null
  declare isFirstNationProgram: boolean
  declare inspectorName: string | null
  declare neighborhood: string | null
  declare region: string | null
  declare lastSubmission: Date | null
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
    isFirstNationProgram: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    inspectorName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    region: {
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
