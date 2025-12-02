import {
  DataTypes,
  Model,
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
  ModelValidator,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { isNil } from "lodash"

import { isValidFiscalYearLegacy } from "@/models/validators"

import Centre from "@/models/centre"
import FiscalPeriod from "@/models/fiscal-period"

@Table({
  paranoid: false,
})
export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fiscalPeriodId: number

  // TODO: normalize to url safe long-form fiscal year 2023-2024
  @Attribute(DataTypes.STRING(10))
  @NotNull
  @ValidateAttribute({
    isValidFiscalYearLegacy,
  })
  declare fiscalYear: string

  @Attribute(DataTypes.DATEONLY)
  @NotNull
  declare paidOn: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  @NotNull
  declare amount: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare name: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getdate"))
  declare updatedAt: CreationOptional<Date>

  // Model Validators
  @ModelValidator
  async ensureFiscalPeriodAndPaidOnConsistency() {
    const fiscalPeriod = await FiscalPeriod.findByPk(this.fiscalPeriodId)

    if (isNil(fiscalPeriod)) {
      throw new Error(`Fiscal period with ID ${this.fiscalPeriodId} not found`)
    }

    const paidOnDate = new Date(this.paidOn)
    const dateStart = new Date(fiscalPeriod.dateStart)
    const dateEnd = new Date(fiscalPeriod.dateEnd)

    if (paidOnDate < dateStart || paidOnDate > dateEnd) {
      throw new Error(
        `Paid on date ${this.paidOn} is not aligned with fiscal period: ` +
          `expected date between ${fiscalPeriod.dateStart} and ${fiscalPeriod.dateEnd}`
      )
    }
  }

  // Associations
  @BelongsTo(() => Centre, {
    foreignKey: "centreId",
    inverse: {
      as: "payments",
      type: "hasMany",
    },
  })
  declare centre?: NonAttribute<Centre>

  @BelongsTo(() => FiscalPeriod, {
    foreignKey: "fiscalPeriodId",
    inverse: {
      as: "payments",
      type: "hasMany",
    },
  })
  declare fiscalPeriod?: NonAttribute<FiscalPeriod>

  static establishScopes() {
    // add as needed
  }
}

export default Payment
