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
  BelongsTo,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import BuildingExpense from "@/models/building-expense"
import EmployeeBenefit from "@/models/employee-benefit"
import FundingReconciliation from "@/models/funding-reconciliation"
import FundingRegion from "@/models/funding-region"
import FundingSubmissionLineJson from "@/models/funding-submission-line-json"
import Payment from "@/models/payment"
import WageEnhancement from "@/models/wage-enhancement"

// TODO: normalize status to snake_case
export enum CentreStatuses {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  UP_TO_DATE = "Up to date",
}

// TODO: split this table into buildings, and companies
export class Centre extends BaseModel<InferAttributes<Centre>, InferCreationAttributes<Centre>> {
  static readonly Statuses = CentreStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fundingRegionId: number

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare community: string

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

  @Attribute(DataTypes.DECIMAL(5, 2))
  @Default("100.00")
  declare buildingUsagePercent: CreationOptional<string>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => FundingRegion, {
    foreignKey: "fundingRegionId",
    inverse: {
      as: "centres",
      type: "hasMany",
    },
  })
  declare fundingRegion?: NonAttribute<FundingRegion>

  @HasMany(() => BuildingExpense, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare buildingExpenses?: NonAttribute<BuildingExpense[]>

  @HasMany(() => EmployeeBenefit, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare employeeBenefits?: NonAttribute<EmployeeBenefit[]>

  @HasMany(() => FundingSubmissionLineJson, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare fundingSubmissionLineJsons?: NonAttribute<FundingSubmissionLineJson[]>

  @HasMany(() => Payment, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare payments?: NonAttribute<Payment[]>

  @HasMany(() => WageEnhancement, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare wageEnhancements?: NonAttribute<WageEnhancement[]>

  @HasMany(() => FundingReconciliation, {
    foreignKey: "centreId",
    inverse: {
      as: "centre",
    },
  })
  declare fundingReconciliations?: NonAttribute<FundingReconciliation[]>

  static establishScopes() {
    // add as needed
  }
}

export default Centre
