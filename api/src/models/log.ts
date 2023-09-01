import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"

import sequelize from "@/db/db-client"

export class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  public declare id: number
  public declare tableName: string
  public declare operation: string
  public declare userEmail: string
  public declare data: string
  public declare date: Date
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tableName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    date: {
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

export default Log
