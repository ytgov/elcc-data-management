import { Attributes, CreationOptional, FindOptions, Model, ModelStatic, Op } from "sequelize"

// See /home/marlen/code/icefoganalytics/elcc-data-management/api/node_modules/sequelize/types/model.d.ts -> Model
export abstract class BaseModel<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  TModelAttributes extends {} = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  declare id: CreationOptional<number>

  // See /home/marlen/code/icefoganalytics/elcc-data-management/api/node_modules/sequelize/types/model.d.ts -> findAll
  // Enforces sort by id, overwriting any supplied order
  public static async findEach<M extends BaseModel>(
    this: ModelStatic<M>,
    options: FindOptions<Attributes<M>> & {
      batchSize?: number
    },
    processFunction: (record: M) => Promise<void>
  ): Promise<void> {
    const batchSize = options.batchSize ?? 1000
    let lastId = 0
    let continueProcessing = true

    while (continueProcessing) {
      const whereClause = {
        ...options.where,
        id: { [Op.gt]: lastId },
      }
      const records = await this.findAll({
        ...options,
        where: whereClause,
        limit: batchSize,
        order: [["id", "ASC"]],
      })

      for (const record of records) {
        await processFunction(record)
        lastId = record.id
      }

      if (records.length < batchSize) {
        continueProcessing = false
      }
    }
  }
}

export default BaseModel
