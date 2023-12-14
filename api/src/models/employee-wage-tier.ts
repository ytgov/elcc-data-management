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
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import BaseModel from "@/models/base-model"
import FiscalPeriod from "@/models/fiscal-period"

export class EmployeeWageTier extends BaseModel<
  InferAttributes<EmployeeWageTier>,
  InferCreationAttributes<EmployeeWageTier>
> {
  declare id: CreationOptional<number>
  declare fiscalPeriodId: ForeignKey<FiscalPeriod["id"]>
  declare tierLevel: number
  declare tierLabel: string
  declare wageRatePerHour: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getFiscalPeriod: BelongsToGetAssociationMixin<FiscalPeriod>
  declare setFiscalPeriod: BelongsToSetAssociationMixin<FiscalPeriod, FiscalPeriod["id"]>
  declare createFiscalPeriod: BelongsToCreateAssociationMixin<FiscalPeriod>

  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  declare static associations: {
    fiscalPeriod: Association<EmployeeWageTier, FiscalPeriod>
  }

  static establishAssociations() {
    this.belongsTo(FiscalPeriod, {
      foreignKey: "fiscalPeriodId",
    })
  }
}

EmployeeWageTier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fiscalPeriodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fiscal_periods", // use real table name here
        key: "id",
      },
    },
    tierLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tierLabel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    wageRatePerHour: {
      type: DataTypes.FLOAT,
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
        fields: ["fiscal_period_id", "tier_level"], // not sure if these need to be snake_case?
      },
    ],
  }
)

export default EmployeeWageTier
