import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

/** Keep in sync with web/src/api/fiscal-periods-api.ts */
export enum FiscalPeriodMonths {
  APRIL = "april",
  MAY = "may",
  JUNE = "june",
  JULY = "july",
  AUGUST = "august",
  SEPTEMBER = "september",
  OCTOBER = "october",
  NOVEMBER = "november",
  DECEMBER = "december",
  JANUARY = "january",
  FEBRUARY = "february",
  MARCH = "march",
}

export class FiscalPeriod extends Model<
  InferAttributes<FiscalPeriod>,
  InferCreationAttributes<FiscalPeriod>
> {
  static readonly Months = FiscalPeriodMonths

  declare id: CreationOptional<number>
  declare fiscalYear: string
  declare month: FiscalPeriodMonths
  declare dateStart: Date
  declare dateEnd: Date
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

FiscalPeriod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fiscalYear: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(FiscalPeriodMonths)],
          msg: `Month must be one of: ${Object.values(FiscalPeriodMonths).join(", ")}`,
        },
      },
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateEnd: {
      type: DataTypes.DATE,
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
        fields: ["fiscal_year", "month"], // not sure if these need to be snake_case?
      },
    ],
  }
)

export default FiscalPeriod
