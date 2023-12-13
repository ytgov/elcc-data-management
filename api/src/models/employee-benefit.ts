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
import Centre from "./centre"
import FiscalPeriod from "./fiscal-period"
import FundingSubmissionLineJson from "./funding-submission-line-json"

export class EmployeeBenefit extends Model<
  InferAttributes<EmployeeBenefit>,
  InferCreationAttributes<EmployeeBenefit>
> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare fiscalPeriodId: ForeignKey<FiscalPeriod["id"]>
  declare grossPayrollMonthlyActual: number
  declare grossPayrollMonthlyEstimated: number
  declare costCapPercentage: number
  declare employeeCostActual: number
  declare employeeCostEstimated: number
  declare employerCostActual: number
  declare employerCostEstimated: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getCentre: BelongsToGetAssociationMixin<Centre>
  declare setCentre: BelongsToSetAssociationMixin<Centre, Centre["id"]>
  declare createCentre: BelongsToCreateAssociationMixin<Centre>

  declare getFiscalPeriod: BelongsToGetAssociationMixin<FiscalPeriod>
  declare setFiscalPeriod: BelongsToSetAssociationMixin<FiscalPeriod, FiscalPeriod["id"]>
  declare createFiscalPeriod: BelongsToCreateAssociationMixin<FiscalPeriod>

  declare centre?: NonAttribute<Centre>
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  declare static associations: {
    centre: Association<FundingSubmissionLineJson, Centre>
    fiscalPeriod: Association<FundingSubmissionLineJson, FiscalPeriod>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
    this.belongsTo(FiscalPeriod, {
      foreignKey: "fiscalPeriodId",
    })
  }
}

EmployeeBenefit.init(
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
        model: "centres", // use real table name here
        key: "id",
      },
    },
    fiscalPeriodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fiscal_periods", // use real table name here
        key: "id",
      },
    },
    grossPayrollMonthlyActual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    grossPayrollMonthlyEstimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costCapPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    employeeCostActual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employeeCostEstimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employerCostActual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employerCostEstimated: {
      type: DataTypes.DECIMAL(10, 2),
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
    indexes: [
      {
        unique: true,
        fields: ["centre_id", "fiscal_period_id"], // not sure if these need to be snake_case?
      },
    ],
  }
)

export default EmployeeBenefit
