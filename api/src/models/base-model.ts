import {
  Model,
  type AttributeNames,
  type Attributes,
  type BulkCreateOptions,
  type CreationAttributes,
  type FindOptions,
  type ModelStatic,
} from "@sequelize/core"

import searchFieldsByTermsFactory from "@/utils/search-fields-by-terms-factory"

// See /home/marlen/code/icefoganalytics/elcc-data-management/api/node_modules/sequelize/types/model.d.ts -> Model
export abstract class BaseModel<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  TModelAttributes extends {} = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  static addSearchScope<M extends BaseModel>(this: ModelStatic<M>, fields: AttributeNames<M>[]) {
    const searchScopeFunction = searchFieldsByTermsFactory<M>(fields)
    this.addScope("search", searchScopeFunction)
  }

  // See api/node_modules/@sequelize/core/lib/model.d.ts -> findAll
  // Taken from https://api.rubyonrails.org/v7.1.0/classes/ActiveRecord/Batches.html#method-i-find_each
  // Enforces sort by id, overwriting any supplied order
  public static async findEach<M extends BaseModel>(
    this: ModelStatic<M>,
    processFunction: (record: M) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel, R = Attributes<M>>(
    this: ModelStatic<M>,
    options: Omit<FindOptions<Attributes<M>>, "raw"> & {
      raw: true
      batchSize?: number
    },
    processFunction: (record: R) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel>(
    this: ModelStatic<M>,
    options: FindOptions<Attributes<M>> & {
      batchSize?: number
    },
    processFunction: (record: M) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel, R = Attributes<M>>(
    this: ModelStatic<M>,
    optionsOrFunction:
      | ((record: M) => Promise<void>)
      | (Omit<FindOptions<Attributes<M>>, "raw"> & { raw: true; batchSize?: number })
      | (FindOptions<Attributes<M>> & { batchSize?: number }),
    maybeFunction?: (record: R | M) => Promise<void>
  ): Promise<void> {
    let options:
      | (FindOptions<Attributes<M>> & { batchSize?: number })
      | (Omit<FindOptions<Attributes<M>>, "raw"> & { raw: true; batchSize?: number })

    // TODO: fix types so that process function is M when not raw
    // and R when raw. Raw is usable, just incorrectly typed.
    let processFunction: (record: M) => Promise<void>

    if (typeof optionsOrFunction === "function") {
      options = {}
      processFunction = optionsOrFunction
    } else if (maybeFunction === undefined) {
      throw new Error("findEach requires a processFunction")
    } else {
      options = optionsOrFunction
      processFunction = maybeFunction
    }

    const batchSize = options.batchSize ?? 1000
    let offset: number = 0
    let continueProcessing = true

    while (continueProcessing) {
      const records = await this.findAll({
        ...options,
        offset,
        limit: batchSize,
      })

      for (const record of records) {
        await processFunction(record)
      }

      offset += records.length

      if (records.length < batchSize) {
        continueProcessing = false
      }
    }
  }

  /**
   * Add the missing batchSize option to bulkCreate.
   */
  public static async bulkCreateBatched<M extends BaseModel>(
    this: ModelStatic<M>,
    records: CreationAttributes<M>[],
    options?: BulkCreateOptions<Attributes<M>> & {
      batchSize?: number
    }
  ): Promise<void> {
    const batchSize = options?.batchSize ?? 1000

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      await this.bulkCreate(batch, options)
    }
  }
}

export default BaseModel
