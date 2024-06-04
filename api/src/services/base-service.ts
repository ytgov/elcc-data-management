// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HasNoArgsConstructor<T> = T extends { new (): any } ? true : false

type CleanConstructorParameters<T extends typeof BaseService> = HasNoArgsConstructor<T> extends true
  ? []
  : ConstructorParameters<T>

export class BaseService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {}

  static perform<T extends typeof BaseService>(
    this: T,
    ...args: CleanConstructorParameters<T>
  ): ReturnType<InstanceType<T>["perform"]> {
    const instance = new this(...args)
    return instance.perform()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perform(): any {
    throw new Error("Not Implemented")
  }
}

export default BaseService

// Type Testing - keeping until I have real tests implemented
// class AsyncService extends BaseService {
//   private param1: number

//   constructor(param1: number) {
//     super()
//     this.param1 = param1
//   }

//   async perform(): Promise<string[]> {
//     return ["async-string1", "async-string2"]
//   }
// }

// class NonAsyncService extends BaseService {
//   perform(): string {
//     return "non-async-string"
//   }
// }

// const param1 = 77
// AsyncService.perform(param1).then((result: string[]) => {
//   logger.log(result)
// })

// const result = NonAsyncService.perform()
// logger.log(result)
