import { isArray, isNil, reduce } from "lodash"

type Extractor<Model> = (model: Model) => any | undefined
type FieldConstructorOptions<Model> = { name?: string; extractor?: Extractor<Model> }

class Field<Model> {
  method: string
  name: string | undefined
  extractor: Extractor<Model> | undefined

  constructor(method: string, { name, extractor }: FieldConstructorOptions<Model> = {}) {
    this.method = method
    this.name = name
    this.extractor = extractor
  }
}

class View<Model extends Record<string, any>> {
  name: string
  fields: Record<string, Field<Model>>

  constructor(name: string) {
    this.name = name
    this.fields = {}
  }

  serialize(model: Model) {
    return reduce(this.fields, (result: Record<string, any>, field: Field<Model>) => {
      const { method, name, extractor } = field
      if (name !== undefined && extractor !== undefined) {
        result[name] = extractor(model)
      } else if (!isNil(extractor)) {
        result[method] = extractor(model)
      } else {
        result[method] = (model)[method]
      }
      return result
    }, {})
  }

  addfields(...methods: string[]): Field<Model>[] {
    return methods.map((method) => {
      return this.addField(method)
    })
  }

  addField(method: string, options: FieldConstructorOptions<Model> = {}): Field<Model> {
    const field = new Field<Model>(method, options)
    this.fields[method] = field
    return field
  }
}

type SerializationOptions = { view?: string }

export default class BaseSerializer<Model extends Record<string, any>> {
  protected views: Record<string, View<Model>>
  protected models: Model[]
  protected model: Model
  protected singular: boolean

  constructor(model: Model)
  constructor(models: Model[])
  constructor(modelOrModels: Model | Model[]) // apparently you need to duplicate this to support friendly child constructors
  constructor(modelOrModels: Model | Model[]) {
    if (isArray(modelOrModels)) {
      this.models = modelOrModels
      this.model = modelOrModels[0] // or maybe should be undefined?
      this.singular = false
    } else {
      this.models = [modelOrModels] // or maybe should be undefined?
      this.model = modelOrModels
      this.singular = true
    }

    this.views = {}
    this.registerDefaultView()
  }

  public static serialize<Model extends Record<string, any>>(
    modelOrModels: Model | Model[],
    options: SerializationOptions = {}
  ): Record<string, any>[] | Record<string, any> {
    const instance = new this(modelOrModels)
    return instance.serialize(options)
  }

  public serialize({ view }: SerializationOptions = {}): Record<string, any>[] | Record<string, any> {
    return this.callView(view)
  }

  protected callView(viewName: string = "default") {
    const view = this.views[viewName]
    if (isNil("view")) throw new Error(`View ${viewName} has not been declared on serializer.`)

    if (this.singular) {
      return view.serialize(this.model)
    } else {
      return this.models.map((model) => {
        return view.serialize(this.model)
      })
    }
  }

  protected addView(name: string): View<Model> {
    const view = new View<Model>(name)
    this.views[name] = view
    return view
  }

  protected registerDefaultView() {
    throw new Error("Not implemented")
  }
}
