import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export class Centre extends Model<InferAttributes<Centre>, InferCreationAttributes<Centre>> {
  declare id: number
  declare name: string
  declare license: string | null
  declare community: string
  declare status: string
  declare hotMeal: boolean | null
  declare licensedFor: number | null
  declare lastSubmission: Date | null
  declare createDate: CreationOptional<Date>
}

Centre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
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
