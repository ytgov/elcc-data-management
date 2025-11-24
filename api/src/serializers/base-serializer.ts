/* eslint-disable @typescript-eslint/no-explicit-any */

type RemainingConstructorParameters<C extends new (...args: any[]) => any> = C extends new (
  head: any,
  ...tail: infer TT
) => any
  ? TT
  : []

/**
 * BaseSerializer is a generic class that provides a common interface for all serializers.
 * It is designed to be extended by other serializers, and provides a static `perform` method
 * that can be used to serialize a single record or an array of records.
 *
 * The `perform` method is overloaded to handle both cases, and will return the serialized
 * record or records based on the input. The return type is determined as the return type of the
 * `perform` instance method of the subclass as a single value or an array of values.
 *
 * The `perform` takes its signature from the constructor of the subclass, while also allowing
 * for an array of records to be passed in as the first argument.
 *
 * @param M The model type that the serializer is designed to handle
 *
 * @example
 * class TableSerializer extends BaseSerializer<Dataset> {
 *   constructor(
 *     protected record: Dataset,
 *     protected currentUser: User
 *   ) {
 *     super(record)
 *   }
 *
 *   perform(): DatasetTableView {}
 * }
 *
 * TableSerializer.perform(dataset, currentUser) // => DatasetTableView
 * TableSerializer.perform([dataset1, dataset2], currentUser) // => [DatasetTableView, DatasetTableView]
 */
export class BaseSerializer<Model> {
  constructor(protected record: Model) {}

  // Overload for handling a single record
  static perform<T extends BaseSerializer<any>, C extends new (...args: any[]) => T>(
    this: C,
    ...args: ConstructorParameters<C>
  ): ReturnType<InstanceType<C>["perform"]>

  // Overload for handling an array of records
  static perform<T extends BaseSerializer<any>, C extends new (...args: any[]) => T>(
    this: C,
    ...args: [ConstructorParameters<C>[0][], ...RemainingConstructorParameters<C>]
  ): ReturnType<InstanceType<C>["perform"]>[]

  // Implementation of the perform method
  static perform<T extends BaseSerializer<any>, C extends new (...args: any[]) => T>(
    this: C,
    ...args:
      | ConstructorParameters<C>
      | [ConstructorParameters<C>[0][], ...RemainingConstructorParameters<C>]
  ): ReturnType<InstanceType<C>["perform"]> | ReturnType<InstanceType<C>["perform"]>[] {
    if (Array.isArray(args[0])) {
      const records = args[0] as ConstructorParameters<C>[0][]
      return records.map((record) => {
        const instance = new this(record, ...args.slice(1))
        return instance.perform()
      }) as ReturnType<InstanceType<C>["perform"]>[]
    } else {
      const instance = new this(...args)
      return instance.perform() as ReturnType<InstanceType<C>["perform"]>
    }
  }

  perform(): any {
    throw new Error("Not Implemented")
  }
}

export default BaseSerializer
