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
import EmployeeWageTier from "./employee-wage-tier"

export class WageEnhancement extends Model<
  InferAttributes<WageEnhancement>,
  InferCreationAttributes<WageEnhancement>
> {
  declare id: CreationOptional<number>
  declare centreId: ForeignKey<Centre["id"]>
  declare employeeWageTierId: number
  declare employeeName: string
  declare hoursEstimated: number
  declare hoursActual: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getCentre: BelongsToGetAssociationMixin<Centre>
  declare setCentre: BelongsToSetAssociationMixin<Centre, Centre["id"]>
  declare createCentre: BelongsToCreateAssociationMixin<Centre>

  declare getEmployeeWageTier: BelongsToGetAssociationMixin<EmployeeWageTier>
  declare setEmployeeWageTier: BelongsToSetAssociationMixin<
    EmployeeWageTier,
    EmployeeWageTier["id"]
  >
  declare createEmployeeWageTier: BelongsToCreateAssociationMixin<EmployeeWageTier>

  declare centre?: NonAttribute<Centre>
  declare employeeWageTier?: NonAttribute<EmployeeWageTier>

  declare static associations: {
    centre: Association<WageEnhancement, Centre>
    employeeWageTier: Association<WageEnhancement, EmployeeWageTier>
  }

  static establishAssociations() {
    this.belongsTo(Centre, {
      foreignKey: "centreId",
    })
    this.belongsTo(EmployeeWageTier, {
      foreignKey: "employeeWageTierId",
    })
  }
}

WageEnhancement.init(
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
    employeeWageTierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employee_wage_tiers",
        key: "id",
      },
    },
    employeeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hoursEstimated: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    hoursActual: {
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
        fields: ["centre_id", "employee_wage_tier_id"], // not sure if these need to be snake_case?
      },
    ],
  }
)

export default WageEnhancement
