import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import CentreFundingPeriod from "@/models/centre-funding-period"
import EmployeeBenefit from "@/models/employee-benefit"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"

// Keep in sync with web/src/api/centres-api.ts
export enum CentreRegions {
  WHITEHORSE = "whitehorse",
  COMMUNITIES = "communities",
}

// TODO: normalize status to snake_case
export enum CentreStatuses {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  UP_TO_DATE = "Up to date",
}

@Table({
  paranoid: false,
})
export class Centre extends BaseModel<InferAttributes<Centre>, InferCreationAttributes<Centre>> {
  static readonly Regions = CentreRegions
  static readonly Statuses = CentreStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare community: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(CentreRegions)],
      msg: `Region must be one of: ${Object.values(CentreRegions).join(", ")}`,
    },
  })
  declare region: string

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(CentreStatuses)],
      msg: `Status must be one of: ${Object.values(CentreStatuses).join(", ")}`,
    },
  })
  declare status: string

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isFirstNationProgram: boolean

  @Attribute(DataTypes.STRING(255))
  declare license: string | null

  @Attribute(DataTypes.BOOLEAN)
  declare hotMeal: boolean | null

  @Attribute(DataTypes.INTEGER)
  declare licensedFor: number | null

  @Attribute(DataTypes.STRING(100))
  declare licenseHolderName: string | null

  @Attribute(DataTypes.STRING(100))
  declare contactName: string | null

  @Attribute(DataTypes.STRING(250))
  declare physicalAddress: string | null

  @Attribute(DataTypes.STRING(250))
  declare mailingAddress: string | null

  @Attribute(DataTypes.STRING(100))
  declare email: string | null

  @Attribute(DataTypes.STRING(100))
  declare altEmail: string | null

  @Attribute(DataTypes.STRING(20))
  declare phoneNumber: string | null

  @Attribute(DataTypes.STRING(20))
  declare altPhoneNumber: string | null

  @Attribute(DataTypes.STRING(20))
  declare faxNumber: string | null

  @Attribute(DataTypes.STRING(20))
  declare vendorIdentifier: string | null

  @Attribute(DataTypes.STRING(100))
  declare inspectorName: string | null

  @Attribute(DataTypes.STRING(100))
  declare neighborhood: string | null

  @Attribute(DataTypes.DATEONLY)
  declare lastSubmission: Date | null

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Associations
  @HasMany(() => EmployeeBenefit, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare employeeBenefits?: NonAttribute<EmployeeBenefit[]>

  @HasMany(() => CentreFundingPeriod, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare fundingPeriods?: NonAttribute<CentreFundingPeriod[]>

  @HasMany(() => FundingSubmissionLineJson, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare fundingSubmissionLineJsons?: NonAttribute<FundingSubmissionLineJson[]>

  static establishScopes() {
    // add as needed
  }
}

export default Centre
